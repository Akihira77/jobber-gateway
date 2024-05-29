import {
    IMessageDocument,
    IOrderDocument,
    IOrderNotifcation
} from "@Akihira77/jobber-shared";
import { MESSAGE_BASE_URL, ORDER_BASE_URL } from "@gateway/config";
import { RedisClient } from "@gateway/redis/gateway.redis";
import { Server, Socket } from "socket.io";
import { io, Socket as SocketClient } from "socket.io-client";
import { Logger } from "winston";

let chatSocketClient: SocketClient;
let orderSocketClient: SocketClient;

export class SocketIOAppHandler {
    private io: Server;

    constructor(
        io: Server,
        private redis: RedisClient,
        private logger: (moduleName: string) => Logger
    ) {
        this.io = io;
    }

    // Listening event from Front End
    public listen(): void {
        this.chatSocketServerIOConnection();
        this.orderSocketServerIOConnection();

        this.io.on("connection", async (socket: Socket) => {
            socket.on("getLoggedInUsers", async () => {
                const response =
                    await this.redis.getLoggedInUsersFromCache(
                        "loggergedInUsers"
                    );

                // send to Frontend
                this.io.emit("online", response);
            });

            socket.on("loggergedInUsers", async (username: string) => {
                const response = await this.redis.saveLoggedInUserToCache(
                    "loggergedInUsers",
                    username
                );

                // send to Frontend
                this.io.emit("online", response);
            });

            socket.on("removeLoggedInUsers", async (username: string) => {
                const response = await this.redis.removeLoggedInUserFromCache(
                    "loggergedInUsers",
                    username
                );

                // send to Frontend
                this.io.emit("online", response);
            });

            socket.on(
                "category",
                async (category: string, username: string) => {
                    await this.redis.saveUserSelectedCategory(
                        `selectedCategories:${username}`,
                        category
                    );
                }
            );
        });
    }

    // Listening event from another chat service
    private chatSocketServerIOConnection(): void {
        chatSocketClient = io(`${MESSAGE_BASE_URL}`, {
            transports: ["websocket", "polling"],
            secure: true
        });

        chatSocketClient.on("connect", () => {
            this.logger(
                "sockets/socket.ts - chatSocketServerIOConnection()"
            ).info(
                "Socket connection to ChatService is successfully established"
            );
        });

        chatSocketClient.on(
            "disconnect",
            (reason: SocketClient.DisconnectReason) => {
                this.logger(
                    "sockets/socket.ts - chatSocketServerIOConnection()"
                ).error("Chat Socket disconnect reason:", reason);

                chatSocketClient.connect();
            }
        );

        chatSocketClient.on("connect_error", (error: Error) => {
            this.logger(
                "sockets/socket.ts - chatSocketServerIOConnection()"
            ).error("Chat Socket connection error:", error);

            while (!chatSocketClient.connect().active) {
                chatSocketClient.connect();
            }
        });

        // Custom Events
        chatSocketClient.on("message_received", (data: IMessageDocument) => {
            this.io.emit("message_received", data);
        });

        chatSocketClient.on("message_updated", (data: IMessageDocument) => {
            this.io.emit("message_updated", data);
        });
    }

    // Listening event from order service
    private orderSocketServerIOConnection(): void {
        orderSocketClient = io(`${ORDER_BASE_URL}`, {
            transports: ["websocket", "polling"],
            secure: true
        });

        orderSocketClient.on("connect", () => {
            this.logger(
                "sockets/socket.ts - orderSocketServerIOConnection()"
            ).info(
                "Socket connection to OrderService is successfully established"
            );
        });

        orderSocketClient.on(
            "disconnect",
            (reason: SocketClient.DisconnectReason) => {
                this.logger(
                    "sockets/socket.ts - orderSocketServerIOConnection()"
                ).error("Order Socket disconnect reason:", reason);

                orderSocketClient.connect();
            }
        );

        orderSocketClient.on("connect_error", (error: Error) => {
            this.logger(
                "sockets/socket.ts - orderSocketServerIOConnection()"
            ).error("Order Socket connection error:", error);

            orderSocketClient.connect();
        });

        // Custom events
        orderSocketClient.on(
            "order_notification",
            (order: IOrderDocument, orderNotification: IOrderNotifcation) => {
                this.io.emit("order_notification", order, orderNotification);
            }
        );
    }
}
