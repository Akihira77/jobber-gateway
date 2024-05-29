"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const redis_conection_1 = require("./redis/redis.conection");
class Application {
    initialize() {
        const app = (0, express_1.default)();
        const server = new server_1.GatewayServer(app);
        server.start();
        redis_conection_1.redisConnection.redisConnect();
    }
}
const application = new Application();
application.initialize();
//# sourceMappingURL=app.js.map