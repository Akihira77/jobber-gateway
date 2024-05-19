import http from "http";
import "express-async-errors";

import {
    CLIENT_URL,
    logger,
    NODE_ENV,
    PORT,
    REDIS_HOST,
    SECRET_KEY_ONE,
    SECRET_KEY_TWO
} from "@gateway/config";
import { CustomError, IErrorResponse } from "@Akihira77/jobber-shared";
import cookieSession from "cookie-session";
import {
    Application,
    NextFunction,
    Request,
    Response,
    json,
    urlencoded
} from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { StatusCodes } from "http-status-codes";
import { elasticSearch } from "@gateway/elasticsearch";
import { appRoutes } from "@gateway/routes";
import { axiosAuthInstance } from "@gateway/services/api/auth.api.service";
import { isAxiosError } from "axios";
import { axiosBuyerInstance } from "@gateway/services/api/buyer.api.service";
import { axiosSellerInstance } from "@gateway/services/api/seller.api.service";
import { axiosGigInstance } from "@gateway/services/api/gig.api.service";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { SocketIOAppHandler } from "@gateway/sockets/socket";
import { axiosChatInstance } from "@gateway/services/api/chat.api.service";
import { axiosOrderInstance } from "@gateway/services/api/order.api.service";
import { axiosReviewInstance } from "@gateway/services/api/review.api.service";
import { createClient } from "redis";
import morgan from "morgan";

const DEFAULT_ERROR_CODE = 500;
export let socketIO: Server;

export class GatewayServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.startElasticSearch();
        this.errorHandler(this.app);
        this.startServer(this.app);
    }

    private securityMiddleware(app: Application): void {
        app.set("trust proxy", 1);
        app.use(
            cookieSession({
                name: "session",
                keys: [`${SECRET_KEY_ONE}`, `${SECRET_KEY_TWO}`],
                maxAge: 7 * 24 * 36 * 10 * 1000, // 7 days,
                secure: NODE_ENV !== "development", // updated with value from config,
                ...(NODE_ENV !== "development" && {
                    sameSite: "none"
                })
            })
        );
        app.use(hpp());
        app.use(helmet());
        app.use(
            cors({
                origin: [`${CLIENT_URL}`],
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
            })
        );

        app.use((req: Request, _res: Response, next: NextFunction) => {
            if (req.session?.jwt) {
                axiosAuthInstance.defaults.headers["Authorization"] =
                    `Bearer ${req.session?.jwt}`;
                axiosBuyerInstance.defaults.headers["Authorization"] =
                    `Bearer ${req.session?.jwt}`;
                axiosSellerInstance.defaults.headers["Authorization"] =
                    `Bearer ${req.session?.jwt}`;
                axiosGigInstance.defaults.headers["Authorization"] =
                    `Bearer ${req.session?.jwt}`;
                axiosChatInstance.defaults.headers["Authorization"] =
                    `Bearer ${req.session?.jwt}`;
                axiosOrderInstance.defaults.headers["Authorization"] =
                    `Bearer ${req.session?.jwt}`;
                axiosReviewInstance.defaults.headers["Authorization"] =
                    `Bearer ${req.session?.jwt}`;
            }

            next();
        });
    }

    private standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({ limit: "200mb" }));
        app.use(urlencoded({ extended: true, limit: "200mb" }));
        app.use(morgan("dev"))
    }

    private routesMiddleware(app: Application): void {
        appRoutes(app);
    }

    private startElasticSearch(): void {
        elasticSearch.checkConnection();
    }

    private errorHandler(app: Application): void {
        app.use("*", (req: Request, res: Response, next: NextFunction) => {
            const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

            logger("server.ts - errorHandler()").error(
                `${fullUrl} endpoint does not exist.`,
                ""
            );

            res.status(StatusCodes.NOT_FOUND).json({
                message: "The endpoint called does not exist."
            });
            next();
        });

        app.use(
            (
                error: IErrorResponse,
                _req: Request,
                res: Response,
                next: NextFunction
            ) => {
                if (error instanceof CustomError) {
                    logger("server.ts - errorHandler()").error(
                        `GatewayService ${error.comingFrom}:`,
                        error
                    );
                    res.status(error.statusCode).json({
                        message: error.message
                    });
                } else if (isAxiosError(error)) {
                    logger("server.ts - errorHandler()").error(
                        `GatewayService Axios Error - ${error?.response?.data?.comingFrom}:`,
                        error.message
                    );
                    res.status(
                        error?.response?.data?.statusCode ?? DEFAULT_ERROR_CODE
                    ).json({
                        message:
                            error?.response?.data?.message ?? "Error occurred."
                    });
                }
                next();
            }
        );
    }

    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app);
            const io: Server = await this.createSocketIO(httpServer);
            this.startHttpServer(httpServer);
            this.socketIOConnections(io);
        } catch (error) {
            logger("server.ts - startServer()").error(
                "GatewayService startServer() method error:",
                error
            );
        }
    }

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io: Server = new Server(httpServer, {
            cors: {
                origin: [`${CLIENT_URL}`],
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
            }
        });
        const pubClient = createClient({ url: `${REDIS_HOST}` });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));

        logger("server.ts - createSocketIO()").info(
            "GatewayService SocketIO and Redis Pub-Sub Adapter is established."
        );
        socketIO = io;
        return io;
    }

    private async startHttpServer(httpServer: http.Server): Promise<void> {
        try {
            logger("server.ts - startHttpServer()").info(
                `GatewayService has started with pid ${process.pid}`
            );

            httpServer.listen(Number(PORT), () => {
                logger("server.ts - startHttpServer()").info(
                    `GatewayService running on port ${PORT}`
                );
            });
        } catch (error) {
            logger("server.ts - startHttpServer()").error(
                "GatewayService startServer() method error:",
                error
            );
        }
    }

    private socketIOConnections(io: Server): void {
        const socketIoApp = new SocketIOAppHandler(io);

        socketIoApp.listen();
    }
}
