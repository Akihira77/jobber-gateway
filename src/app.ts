import express, { Express } from "express";
import { GatewayServer } from "@gateway/server";
import { redisConnection } from "@gateway/redis/redis.conection";

class Application {
    public initialize(): void {
        const app: Express = express();
        const server: GatewayServer = new GatewayServer(app);
        server.start();
        redisConnection.redisConnect();
    }
}

const application = new Application();
application.initialize();
