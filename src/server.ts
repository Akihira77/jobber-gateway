import http from "http"

import {
    CLIENT_URL,
    NODE_ENV,
    PORT,
    REDIS_HOST,
    SECRET_KEY_ONE,
    SECRET_KEY_TWO
} from "@gateway/config"
import { CustomError } from "@Akihira77/jobber-shared"
import { StatusCodes } from "http-status-codes"
import { appRoutes } from "@gateway/routes"
import { axiosAuthInstance } from "@gateway/services/api/auth.api.service"
import { isAxiosError } from "axios"
import { axiosBuyerInstance } from "@gateway/services/api/buyer.api.service"
import { axiosSellerInstance } from "@gateway/services/api/seller.api.service"
import { axiosGigInstance } from "@gateway/services/api/gig.api.service"
import { Server } from "socket.io"
import { App } from "uWebSockets.js"
import { createAdapter } from "@socket.io/redis-adapter"
import { SocketIOAppHandler } from "@gateway/sockets/socket"
import { axiosChatInstance } from "@gateway/services/api/chat.api.service"
import { axiosOrderInstance } from "@gateway/services/api/order.api.service"
import { axiosReviewInstance } from "@gateway/services/api/review.api.service"
import { Logger } from "winston"
import { Context, Hono, Next } from "hono"
import { cors } from "hono/cors"
import { compress } from "hono/compress"
import { timeout } from "hono/timeout"
import { csrf } from "hono/csrf"
import { secureHeaders } from "hono/secure-headers"
import { bodyLimit } from "hono/body-limit"
import { rateLimiter } from "hono-rate-limiter"
import { HTTPException } from "hono/http-exception"
import { getSignedCookie } from "hono/cookie"
import { StatusCode } from "hono/utils/http-status"
import { ServerType } from "@hono/node-server/dist/types"
import { serve } from "@hono/node-server"
import { logger } from "hono/logger"
import { RedisClient } from "./redis/gateway.redis"
import { prometheus } from "@hono/prometheus"
import { Redis } from "ioredis"

const DEFAULT_ERROR_CODE = 500
export let socketIO: Server
const LIMIT_TIMEOUT = 3 * 1000 + 500 // ms

const { printMetrics, registerMetrics } = prometheus({
    collectDefaultMetrics: true
})

export class GatewayServer {
    private app: Hono

    constructor(app: Hono) {
        this.app = app
    }

    public start(
        redis: RedisClient,
        logger: (moduleName: string) => Logger
    ): void {
        this.errorHandler(this.app, logger)
        this.securityMiddleware(this.app)
        this.standardMiddleware(this.app)
        this.routesMiddleware(this.app, redis)
        this.startServer(this.app, redis, logger)
    }

    private securityMiddleware(app: Hono): void {
        app.use(
            timeout(LIMIT_TIMEOUT, () => {
                return new HTTPException(StatusCodes.REQUEST_TIMEOUT, {
                    message: `Request timeout after waiting ${LIMIT_TIMEOUT}ms. Please try again later.`
                })
            })
        )
        app.use(secureHeaders())
        app.use(
            csrf({
                origin: [`${CLIENT_URL}`]
            })
        )
        app.use(
            cors({
                origin: [`${CLIENT_URL}`],
                credentials: true,
                allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
            })
        )
        app.use(async (c: Context, next: Next) => {
            let token = await getSignedCookie(
                c,
                `${SECRET_KEY_ONE}${SECRET_KEY_TWO}`,
                "session"
            )

            if (!token) {
                const authHeader = c.req.header("Authorization")
                if (authHeader && authHeader.startsWith("Bearer ")) {
                    token = authHeader.split("Bearer ")[1]
                }
            }

            if (token) {
                axiosAuthInstance.defaults.headers["Authorization"] =
                    `Bearer ${token}`
                axiosBuyerInstance.defaults.headers["Authorization"] =
                    `Bearer ${token}`
                axiosSellerInstance.defaults.headers["Authorization"] =
                    `Bearer ${token}`
                axiosGigInstance.defaults.headers["Authorization"] =
                    `Bearer ${token}`
                axiosChatInstance.defaults.headers["Authorization"] =
                    `Bearer ${token}`
                axiosOrderInstance.defaults.headers["Authorization"] =
                    `Bearer ${token}`
                axiosReviewInstance.defaults.headers["Authorization"] =
                    `Bearer ${token}`
            }

            await next()
        })
    }

    private standardMiddleware(app: Hono): void {
        if (NODE_ENV !== "production") {
            app.use(logger())
        }
        app.use("*", registerMetrics)
        app.get("/metrics", printMetrics)

        app.use(compress())
        app.use(
            bodyLimit({
                maxSize: 2 * 100 * 1000 * 1024, //200mb
                onError(c: Context) {
                    return c.text(
                        "Your request is too big",
                        StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE
                    )
                }
            })
        )

        const generateRandomNumber = (length: number): number => {
            return (
                Math.floor(Math.random() * (9 * Math.pow(10, length - 1))) +
                Math.pow(10, length - 1)
            )
        }

        app.use(
            rateLimiter({
                windowMs: 15 * 60 * 1000, //15 minutes
                limit: 100,
                standardHeaders: "draft-6",
                keyGenerator: () => generateRandomNumber(12).toString()
            })
        )
    }

    private routesMiddleware(app: Hono, redis: RedisClient): void {
        appRoutes(app, redis)
    }

    private errorHandler(
        app: Hono,
        logger: (moduleName: string) => Logger
    ): void {
        app.notFound((c) => {
            return c.text("Route path is not found", StatusCodes.NOT_FOUND)
        })

        app.onError((err: Error, c: Context) => {
            if (err instanceof CustomError) {
                logger("server.ts - errorHandler()").error(
                    `GatewayService ${err.comingFrom}:`,
                    err
                )
                return c.json(
                    err.serializeErrors(),
                    (err.statusCode as StatusCode) ??
                        StatusCodes.INTERNAL_SERVER_ERROR
                )
            } else if (err instanceof HTTPException) {
                return err.getResponse()
            } else if (isAxiosError(err)) {
                if (err.code === "ERR_CANCELED") {
                    logger("server.ts - errorHandler()").error(
                        `${new Date().toISOString()} Request ERR_CANCELED path: ${err.request._options.path}`
                    )
                    return c.json(
                        {
                            message:
                                err.config?.timeoutErrorMessage ??
                                "The request takes too long"
                        },
                        StatusCodes.REQUEST_TIMEOUT
                    )
                } else if (err.code === "ECONNRESET") {
                    logger("server.ts - errorHandler()").error(
                        `${new Date().toISOString()} Request ECONNRESET path: ${err.request._options.path}`
                    )
                    return c.json(
                        {
                            message:
                                "The connection is being reset. Try again after sometimes."
                        },
                        StatusCodes.INTERNAL_SERVER_ERROR
                    )
                }

                logger("server.ts - errorHandler()").error(
                    `GatewayService Axios Error - ${err.response?.data} ${err.config?.baseURL}/${err.config?.url}`
                )
                return c.json(
                    {
                        message:
                            err?.response?.data?.message ?? "Error occurred."
                    },
                    err?.response?.data?.statusCode ?? DEFAULT_ERROR_CODE
                )
            }

            logger("server.ts - errorHandler()").error(err.message)
            return c.text(
                "Unexpected error occured. Please try again",
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        })
    }

    private async startServer(
        app: Hono,
        redis: RedisClient,
        logger: (moduleName: string) => Logger
    ): Promise<void> {
        try {
            this.startHttpServer(app, logger)
            const io: Server = await this.createSocketIO(logger)
            this.socketIOConnections(io, redis, logger)
        } catch (error) {
            logger("server.ts - startServer()").error(
                "GatewayService startServer() method error:",
                error
            )
        }
    }

    private async createSocketIO(
        logger: (moduleName: string) => Logger
    ): Promise<Server> {
        const io: Server = new Server({
            cors: {
                origin: [`${CLIENT_URL}`],
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
            }
        })

        const uwsApp = App()
        io.attachApp(uwsApp)
        const pubClient = new Redis(`${REDIS_HOST}`)
        const subClient = pubClient.duplicate()

        io.adapter(createAdapter(pubClient, subClient))

        logger("server.ts - createSocketIO()").info(
            "GatewayService SocketIO and Redis Pub-Sub Adapter is established."
        )
        socketIO = io

        uwsApp.listen(Number(PORT) - 1000, (token) => {
            if (!token) {
                logger("server.ts - createSocketIO()").warn(
                    "Port already in use"
                )
            } else {
                logger("server.ts - createSocketIO()").info(
                    `uWebSockets.js is running on port ${Number(PORT) - 1000}`
                )
            }
        })
        return io
    }

    private startHttpServer(
        hono: Hono,
        logger: (moduleName: string) => Logger
    ): ServerType {
        try {
            logger("server.ts - startHttpServer()").info(
                `GatewayService has started with pid ${process.pid}`
            )

            const server = serve(
                {
                    fetch: hono.fetch,
                    port: Number(PORT),
                    createServer: http.createServer
                },
                (info) => {
                    logger("server.ts - startHttpServer()").info(
                        `GatewayService running on port ${info.port}`
                    )
                }
            )

            return server
        } catch (error) {
            logger("server.ts - startHttpServer()").error(
                "GatewayService startServer() method error:",
                error
            )

            process.exit(1)
        }
    }

    private socketIOConnections(
        io: Server,
        redis: RedisClient,
        logger: (moduleName: string) => Logger
    ): void {
        const socketIoApp = new SocketIOAppHandler(io, redis, logger)

        socketIoApp.listen()
    }
}
