import { Redis } from "ioredis"
// import { createClient, RedisClientType } from "redis"
import { Logger } from "winston"
import { REDIS_HOST } from "../config"
import typia from "typia"

export class RedisClient {
    public client: Redis
    // public client: RedisClientType

    constructor(private logger: (moduleName: string) => Logger) {
        this.client = new Redis(`${REDIS_HOST}`)
        // this.client = createClient({
        //     url: `${REDIS_HOST}`,
        //     isolationPoolOptions: {
        //         max: 20,
        //         idleTimeoutMillis: 30 * 60 * 1000
        //     }
        // })
    }

    // async redisConnect(): Promise<void> {
    //     try {
    //         await this.client.connect()
    //         this.logger("redis/redis.connection.ts - redisConnect()").info(
    //             `GatewayService Redis Connected: ${this.client.isReady}`
    //         )
    //         this.catchError()
    //         this.closeConnection(this.client)
    //     } catch (error) {
    //         this.logger("redis/redis.connection.ts - redisConnect()").error(
    //             "GatewayService redisConnect() method error:",
    //             error
    //         )
    //     }
    // }

    // private async reconnectingClient(): Promise<void> {
    //     if (!this.client.isOpen) {
    //     await this.client.connect()
    //     }
    // }

    public getDataFromCache(key: string): Promise<string | null> {
        try {
            return this.client.get(key)
        } catch (error) {
            this.logger("redis/gateway.redis.ts - getDataFromCache()").error(
                "GatewayService Redis Cache getDataFromCache() method error:",
                error
            )
            return Promise.resolve(null)
        }
    }

    public setDataToCache(
        key: string,
        value: any,
        ttl: number
    ): Promise<string | null> {
        try {
            return this.client.set(key, typia.json.stringify(value), "EX", ttl)
            // return this.client.set(key, typia.json.stringify(value), {
            //     EX: ttl
            // })
        } catch (error) {
            this.logger("redis/gateway.redis.ts - setDataFromCache()").error(
                "GatewayService Redis Cache setDataFromCache() method error:",
                error
            )
            return Promise.resolve(null)
        }
    }

    public async removeDataFromCache(key: string): Promise<boolean> {
        try {
            return (await this.client.del(key)) > 0
        } catch (error) {
            this.logger("redis/gateway.redis.ts - getDataFromCache()").error(
                "GatewayService Redis Cache getDataFromCache() method error:",
                error
            )
            return false
        }
    }

    public flushCacheData(): void {
        try {
            this.client.flushall()
        } catch (error) {
            this.logger("redis/gateway.redis.ts - flushCachedData()").error(
                error
            )
        }
    }

    public saveUserSelectedCategory(key: string, value: string): void {
        try {
            this.client.set(key, value)
        } catch (error) {
            this.logger(
                "redis/gateway.cache.ts - saveUserSelectedCategory()"
            ).error(
                "GatewayService Redis Cache saveUserSelectedCategory() method error:",
                error
            )
        }
    }

    public async saveLoggedInUserToCache(
        key: string,
        value: string
    ): Promise<string[]> {
        try {
            // await this.reconnectingClient()

            const index: number | null = await this.client.lpos(key, value)
            if (index === null) {
                await this.client.lpush(key, value)
                this.logger(
                    "redis/gateway.cache.ts - saveLoggedInUserToCache()"
                ).info(`User ${value} added to Gateway Redis Cache`)
            }

            const result: string[] = await this.client.lrange(key, 0, -1)

            return result
        } catch (error) {
            this.logger(
                "redis/gateway.cache.ts - saveLoggedInUserToCache()"
            ).error(
                "GatewayService Redis Cache saveLoggedInUserToCache() method error:",
                error
            )
            return []
        }
    }

    public async getLoggedInUsersFromCache(key: string): Promise<string[]> {
        try {
            // await this.reconnectingClient()

            const result: string[] = await this.client.lrange(key, 0, -1)

            return result
        } catch (error) {
            this.logger(
                "redis/gateway.cache.ts - getLoggedInUsersFromCache()"
            ).error(
                "GatewayService Redis Cache getLoggedInUsersFromCache() method error:",
                error
            )
            return []
        }
    }

    public async removeLoggedInUserFromCache(
        key: string,
        value: string
    ): Promise<string[]> {
        try {
            // await this.reconnectingClient()

            await this.client.lrem(key, 1, value)

            this.logger(
                "redis/gateway.cache.ts - removeLoggedInUserFromCache()"
            ).info(`User ${value} remove from Gateway Redis Cache`)

            const result: string[] = await this.client.lrange(key, 0, -1)

            return result
        } catch (error) {
            this.logger(
                "redis/gateway.cache.ts - removeLoggedInUserFromCache()"
            ).error(
                "GatewayService Redis Cache removeLoggedInUserFromCache() method error:",
                error
            )
            return []
        }
    }

    // private catchError(): void {
    //     this.client.on("error", (error: unknown) => {
    //         this.logger("redis/redis.connection.ts - catchError()").error(error)
    //     })
    // }

    closeConnection(redis: Redis): void {
        process.once("exit", async () => {
            await redis.quit()
        })
    }
}
