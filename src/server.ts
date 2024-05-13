import http from "http";
import "express-async-errors";

import {
    CLIENT_URL,
    ELASTIC_SEARCH_URL,
    NODE_ENV,
    PORT,
    SECRET_KEY_ONE,
    SECRET_KEY_TWO
} from "@gateway/config";
import {
    CustomError,
    IErrorResponse,
    winstonLogger
} from "@Akihira77/jobber-shared";
import cookieSession from "cookie-session";
import {
    Application,
    NextFunction,
    Request,
    Response,
    json,
    urlencoded
} from "express";
import { Logger } from "winston";
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
import { redisConnection } from "./redis/redis.conection";

const DEFAULT_ERROR_CODE = 500;
const log: Logger = winstonLogger(
    `${ELASTIC_SEARCH_URL}`,
    "apiGatewayServer",
    "debug"
);
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

            log.error(`${fullUrl} endpoint does not exist.`, "");

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
                    log.error(`GatewayService ${error.comingFrom}:`, error);
                    res.status(error.statusCode).json({
                        message: error.message
                    });
                } else if (isAxiosError(error)) {
                    // console.log(error);
                    log.log(
                        "error",
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
            log.error("GatewayService startServer() method error:", error);
        }
    }

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io: Server = new Server(httpServer, {
            cors: {
                origin: [`${CLIENT_URL}`],
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
            }
        });
        const pubClient = redisConnection.client;
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));

        socketIO = io;
        return io;
    }

    private async startHttpServer(httpServer: http.Server): Promise<void> {
        try {
            log.info(
                `Gateway server has started with process id ${process.pid}. Date ${new Date()}`
            );

            httpServer.listen(Number(PORT), () => {
                log.info(`Gateway server running on port ${PORT}`);
            });
        } catch (error) {
            log.error("GatewayService startServer() method error:", error);
        }
    }

    private socketIOConnections(io: Server): void {
        const socketIoApp = new SocketIOAppHandler(io);

        socketIoApp.listen();
    }
}
