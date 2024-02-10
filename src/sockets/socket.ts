import { IMessageDocument, winstonLogger } from "@Akihira77/jobber-shared";
import { ELASTIC_SEARCH_URL, MESSAGE_BASE_URL } from "@gateway/config";
import { GatewayCache } from "@gateway/redis/gateway.cache";
import { Server, Socket } from "socket.io";
import { io, Socket as SocketClient } from "socket.io-client";
import { Logger } from "winston";

const log: Logger = winstonLogger(
    `${ELASTIC_SEARCH_URL}`,
    `gatewaySocket`,
    "debug"
);
let chatSocketClient: SocketClient;

export class SocketIOAppHandler {
    private io: Server;
    private gatewayCache: GatewayCache;

    constructor(io: Server) {
        this.io = io;
        this.gatewayCache = new GatewayCache();
        this.chatSocketServerIOConnection();
    }

    // Listening event from Front End
    public listen(): void {
        this.chatSocketServerIOConnection();

        this.io.on("connection", async (socket: Socket) => {
            socket.on("getLoggedInUsers", async () => {
                const response =
                    await this.gatewayCache.getLoggedInUsersFromCache(
                        "loggedInUsers"
                    );

                // send to Frontend
                this.io.emit("online", response);
            });

            socket.on("loggedInUsers", async (username: string) => {
                const response =
                    await this.gatewayCache.saveLoggedInUserToCache(
                        "loggedInUsers",
                        username
                    );

                // send to Frontend
                this.io.emit("online", response);
            });

            socket.on("removeLoggedInUsers", async (username: string) => {
                const response =
                    await this.gatewayCache.removeLoggedInUserFromCache(
                        "loggedInUsers",
                        username
                    );

                // send to Frontend
                this.io.emit("online", response);
            });

            socket.on(
                "category",
                async (category: string, username: string) => {
                    await this.gatewayCache.saveUserSelectedCategory(
                        `selectedCategories:${username}`,
                        category
                    );
                }
            );
        });
    }

    // Listening event from another service
    private chatSocketServerIOConnection(): void {
        chatSocketClient = io(`${MESSAGE_BASE_URL}`, {
            transports: ["websocket", "polling"],
            secure: true
        });

        chatSocketClient.on("connect", () => {
            log.info("ChatService socket connected");
        });

        chatSocketClient.on(
            "disconnect",
            (reason: SocketClient.DisconnectReason) => {
                log.error("Chat Socket disconnect reason:", reason);

                chatSocketClient.connect();
            }
        );

        chatSocketClient.on("connect_error", (error: Error) => {
            log.error("Chat Socket connection error:", error);

            chatSocketClient.connect();
        });

        // Custom Events
        chatSocketClient.on("message_received", (data: IMessageDocument) => {
            this.io.emit("message_received", data);
        });

        chatSocketClient.on("message_updated", (data: IMessageDocument) => {
            this.io.emit("message_updated", data);
        });
    }
}
