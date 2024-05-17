import { logger } from "@gateway/config";

import { RedisClient, redisConnection } from "./redis.conection";

export class GatewayCache {
    client: RedisClient;

    constructor() {
        this.client = redisConnection.client;
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
            logger("redis/gateway.cache.ts - saveUserSelectedCategory()").error(
                "GatewayService Redis Cache saveUserSelectedCategory() method error:",
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
                logger(
                    "redis/gateway.cache.ts - saveLoggedInUserToCache()"
                ).info(`User ${value} added to Gateway Redis Cache`);
            }

            const result: string[] = await this.client.LRANGE(key, 0, -1);

            return result;
        } catch (error) {
            logger("redis/gateway.cache.ts - saveLoggedInUserToCache()").error(
                "GatewayService Redis Cache saveLoggedInUserToCache() method error:",
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
            logger(
                "redis/gateway.cache.ts - getLoggedInUsersFromCache()"
            ).error(
                "GatewayService Redis Cache getLoggedInUsersFromCache() method error:",
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

            logger(
                "redis/gateway.cache.ts - removeLoggedInUserFromCache()"
            ).info(`User ${value} remove from Gateway Redis Cache`);

            const result: string[] = await this.client.LRANGE(key, 0, -1);

            return result;
        } catch (error) {
            logger(
                "redis/gateway.cache.ts - removeLoggedInUserFromCache()"
            ).error(
                "GatewayService Redis Cache removeLoggedInUserFromCache() method error:",
                error
            );
            return [];
        }
    }
}
