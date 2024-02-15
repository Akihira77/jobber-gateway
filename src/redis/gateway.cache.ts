import { winstonLogger } from "@Akihira77/jobber-shared";
import { ELASTIC_SEARCH_URL, REDIS_HOST } from "@gateway/config";
import { createClient } from "redis";
import { Logger } from "winston";

const log: Logger = winstonLogger(
    `${ELASTIC_SEARCH_URL}`,
    "gatewayCache",
    "debug"
);

export type RedisClient = ReturnType<typeof createClient>;

export class GatewayCache {
    client: RedisClient;

    constructor() {
        this.client = createClient({ url: `${REDIS_HOST}` });
    }

    private async reconnectingClient(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    public async saveUserSelectedCategory(
        key: string,
        value: string
    ): Promise<void> {
        try {
            await this.reconnectingClient();

            await this.client.SET(key, value);
        } catch (error) {
            log.error(
                "GatewayService GatewayCache saveUserSelectedCategory() method error:",
                error
            );
        }
    }

    public async saveLoggedInUserToCache(
        key: string,
        value: string
    ): Promise<string[]> {
        try {
            await this.reconnectingClient();

            const index: number | null = await this.client.LPOS(key, value);
            if (index === null) {
                await this.client.LPUSH(key, value);
                log.info(`User ${value} added to Gateway Redis Cache`);
            }

            const result: string[] = await this.client.LRANGE(key, 0, -1);

            return result;
        } catch (error) {
            log.error(
                "GatewayService GatewayCache saveLoggedInUserToCache() method error:",
                error
            );
            return [];
        }
    }

    public async getLoggedInUsersFromCache(key: string): Promise<string[]> {
        try {
            await this.reconnectingClient();

            const result: string[] = await this.client.LRANGE(key, 0, -1);

            return result;
        } catch (error) {
            log.error(
                "GatewayService GatewayCache getLoggedInUsersFromCache() method error:",
                error
            );
            return [];
        }
    }

    public async removeLoggedInUserFromCache(
        key: string,
        value: string
    ): Promise<string[]> {
        try {
            await this.reconnectingClient();

            await this.client.LREM(key, 1, value);

            log.info(`User ${value} remove from Gateway Redis Cache`);

            const result: string[] = await this.client.LRANGE(key, 0, -1);

            return result;
        } catch (error) {
            log.error(
                "GatewayService GatewayCache removeLoggedInUserFromCache() method error:",
                error
            );
            return [];
        }
    }
}
