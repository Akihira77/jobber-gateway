import {
    IMessageDocument,
    IOrderDocument,
    IOrderNotifcation
} from "@Akihira77/jobber-shared"
import { MESSAGE_WS_BASE_URL, ORDER_WS_BASE_URL } from "@gateway/config"
import { RedisClient } from "@gateway/redis/gateway.redis"
import { Server, Socket } from "socket.io"
import { io, Socket as SocketClient } from "socket.io-client"
import { Logger } from "winston"

let chatSocketClient: SocketClient
let orderSocketClient: SocketClient

export class SocketIOAppHandler {
    private io: Server

    constructor(
        io: Server,
        private redis: RedisClient,
        private logger: (moduleName: string) => Logger
    ) {
        this.io = io
    }

    // Listening event from Front End
    public listen(): void {
        this.chatSocketServerIOConnection()
        this.orderSocketServerIOConnection()

        this.io.on("connection", async (socket: Socket) => {
            socket.on("getLoggedInUsers", async () => {
                const response =
                    await this.redis.getLoggedInUsersFromCache("loggerInUsers")

                // send to Frontend
                this.io.emit("online", response)
            })

            socket.on("loggerInUsers", async (username: string) => {
                const response = await this.redis.saveLoggedInUserToCache(
                    "loggerInUsers",
                    username
                )

                // send to Frontend
                this.io.emit("online", response)
            })

            socket.on("removeLoggedInUsers", async (username: string) => {
                const response = await this.redis.removeLoggedInUserFromCache(
                    "loggerInUsers",
                    username
                )

                // send to Frontend
                this.io.emit("online", response)
            })

            socket.on("category", (category: string, username: string) => {
                this.redis.saveUserSelectedCategory(
                    `selectedCategories:${username}`,
                    category
                )
            })
        })
    }

    // Listening event from another chat service
    private chatSocketServerIOConnection(): void {
        chatSocketClient = io(`${MESSAGE_WS_BASE_URL}`, {
            transports: ["websocket"],
            secure: true,
            withCredentials: true,
            reconnection: true,
            retries: 10
        })

        chatSocketClient.on("connect", () => {
            this.logger(
                "sockets/socket.ts - chatSocketServerIOConnection()"
            ).info(
                "Socket connection to ChatService is successfully established"
            )
        })

        const intv = setInterval(() => {
            chatSocketClient.emit("am_alive")
        }, 2000)

        chatSocketClient.on(
            "disconnect",
            (reason: SocketClient.DisconnectReason) => {
                this.logger(
                    "sockets/socket.ts - chatSocketServerIOConnection()"
                ).error("Chat Socket disconnect reason:", reason)

                clearInterval(intv)
            }
        )

        // Custom Events
        chatSocketClient.on("message_received", (data: IMessageDocument) => {
            this.io.emit("message_received", data)
        })

        chatSocketClient.on("message_updated", (data: IMessageDocument) => {
            this.io.emit("message_updated", data)
        })

        chatSocketClient.once("SIGTERM", () => {
            chatSocketClient.close()
        })
    }

    // Listening event from order service
    private orderSocketServerIOConnection(): void {
        orderSocketClient = io(`${ORDER_WS_BASE_URL}`, {
            transports: ["websocket"],
            secure: true,
            withCredentials: true,
            reconnection: true,
            retries: 10
        })

        orderSocketClient.on("connect", () => {
            this.logger(
                "sockets/socket.ts - orderSocketServerIOConnection()"
            ).info(
                "Socket connection to OrderService is successfully established"
            )
        })

        const intv = setInterval(() => {
            orderSocketClient.emit("am_alive")
        }, 2000)

        orderSocketClient.on(
            "disconnect",
            (reason: SocketClient.DisconnectReason) => {
                this.logger(
                    "sockets/socket.ts - orderSocketServerIOConnection()"
                ).error("Order Socket disconnect reason:", reason)

                clearInterval(intv)
            }
        )

        // Custom events
        orderSocketClient.on(
            "order_notification",
            (order: IOrderDocument, orderNotification: IOrderNotifcation) => {
                this.io.emit("order_notification", order, orderNotification)
            }
        )

        orderSocketClient.once("SIGTERM", () => {
            chatSocketClient.close()
        })
    }
}
