import { createClient } from "redis";
import { winstonLogger } from "@Akihira77/jobber-shared";
import { ELASTIC_SEARCH_URL, REDIS_HOST } from "@gateway/config";
import { Logger } from "winston";

const log: Logger = winstonLogger(
    `${ELASTIC_SEARCH_URL}`,
    "gatewayRedisConnection",
    "debug"
);

export type RedisClient = ReturnType<typeof createClient>;

class RedisConnection {
    client: RedisClient;

    constructor() {
        this.client = createClient({ url: `${REDIS_HOST}` });
    }

    async redisConnect(): Promise<void> {
        try {
            await this.client.connect();
            log.info(
                `GatewayService Redis Connection ${await this.client.ping()}`
            );
            this.catchError();
        } catch (error) {
            log.error("GatewayService redisConnect() method error:", error);
        }
    }

    private catchError(): void {
        this.client.on("error", (error: unknown) => {
            log.error(error);
        });
    }
}

export const redisConnection = new RedisConnection();
