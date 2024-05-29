"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOAppHandler = void 0;
const config_1 = require("../config");
const gateway_cache_1 = require("../redis/gateway.cache");
const socket_io_client_1 = require("socket.io-client");
let chatSocketClient;
let orderSocketClient;
class SocketIOAppHandler {
    constructor(io) {
        this.io = io;
        this.gatewayCache = new gateway_cache_1.GatewayCache();
    }
    // Listening event from Front End
    listen() {
        this.chatSocketServerIOConnection();
        this.orderSocketServerIOConnection();
        this.io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
            socket.on("getLoggedInUsers", () => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.gatewayCache.getLoggedInUsersFromCache("loggergedInUsers");
                // send to Frontend
                this.io.emit("online", response);
            }));
            socket.on("loggergedInUsers", (username) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.gatewayCache.saveLoggedInUserToCache("loggergedInUsers", username);
                // send to Frontend
                this.io.emit("online", response);
            }));
            socket.on("removeLoggedInUsers", (username) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.gatewayCache.removeLoggedInUserFromCache("loggergedInUsers", username);
                // send to Frontend
                this.io.emit("online", response);
            }));
            socket.on("category", (category, username) => __awaiter(this, void 0, void 0, function* () {
                yield this.gatewayCache.saveUserSelectedCategory(`selectedCategories:${username}`, category);
            }));
        }));
    }
    // Listening event from another chat service
    chatSocketServerIOConnection() {
        chatSocketClient = (0, socket_io_client_1.io)(`${config_1.MESSAGE_BASE_URL}`, {
            transports: ["websocket", "polling"],
            secure: true
        });
        chatSocketClient.on("connect", () => {
            (0, config_1.logger)("sockets/socket.ts - chatSocketServerIOConnection()").info("Socket connection to ChatService is successfully established");
        });
        chatSocketClient.on("disconnect", (reason) => {
            (0, config_1.logger)("sockets/socket.ts - chatSocketServerIOConnection()").error("Chat Socket disconnect reason:", reason);
            chatSocketClient.connect();
        });
        chatSocketClient.on("connect_error", (error) => {
            (0, config_1.logger)("sockets/socket.ts - chatSocketServerIOConnection()").error("Chat Socket connection error:", error);
            while (!chatSocketClient.connect().active) {
                chatSocketClient.connect();
            }
        });
        // Custom Events
        chatSocketClient.on("message_received", (data) => {
            this.io.emit("message_received", data);
        });
        chatSocketClient.on("message_updated", (data) => {
            this.io.emit("message_updated", data);
        });
    }
    // Listening event from order service
    orderSocketServerIOConnection() {
        orderSocketClient = (0, socket_io_client_1.io)(`${config_1.ORDER_BASE_URL}`, {
            transports: ["websocket", "polling"],
            secure: true
        });
        orderSocketClient.on("connect", () => {
            (0, config_1.logger)("sockets/socket.ts - orderSocketServerIOConnection()").info("Socket connection to OrderService is successfully established");
        });
        orderSocketClient.on("disconnect", (reason) => {
            (0, config_1.logger)("sockets/socket.ts - orderSocketServerIOConnection()").error("Order Socket disconnect reason:", reason);
            orderSocketClient.connect();
        });
        orderSocketClient.on("connect_error", (error) => {
            (0, config_1.logger)("sockets/socket.ts - orderSocketServerIOConnection()").error("Order Socket connection error:", error);
            orderSocketClient.connect();
        });
        // Custom events
        orderSocketClient.on("order_notification", (order, orderNotification) => {
            this.io.emit("order_notification", order, orderNotification);
        });
    }
}
exports.SocketIOAppHandler = SocketIOAppHandler;
//# sourceMappingURL=socket.js.map