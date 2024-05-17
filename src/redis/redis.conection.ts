import { createClient } from "redis";
import { logger, REDIS_HOST } from "@gateway/config";

export type RedisClient = ReturnType<typeof createClient>;

class RedisConnection {
    client: RedisClient;

    constructor() {
        this.client = createClient({ url: `${REDIS_HOST}` });
    }

    async redisConnect(): Promise<void> {
        try {
            await this.client.connect();
            logger("redis/redis.connection.ts - redisConnect()").info(
                `GatewayService Redis Connected: ${this.client.isReady}`
            );
            this.catchError();
        } catch (error) {
            logger("redis/redis.connection.ts - redisConnect()").error(
                "GatewayService redisConnect() method error:",
                error
            );
        }
    }

    private catchError(): void {
        this.client.on("error", (error: unknown) => {
            logger("redis/redis.connection.ts - catchError()").error(error);
        });
    }
}

export const redisConnection = new RedisConnection();
