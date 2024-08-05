import { GatewayServer } from "@gateway/server"
import { Logger } from "winston"
import { winstonLogger } from "@Akihira77/jobber-shared"
import { Hono } from "hono/quick"

import { ELASTIC_SEARCH_URL, NODE_ENV } from "./config"
import { RedisClient } from "./redis/gateway.redis"
import os from "node:os"
import cluster from "node:cluster"
import { EventEmitter } from "events"

EventEmitter.setMaxListeners(20)

process.once("SIGINT", () => {
    process.exit(1)
})

process.once("SIGTERM", () => {
    process.exit(1)
})

class Application {
    private logger: (moduleName?: string) => Logger
    private redis: RedisClient
    constructor() {
        this.logger = (moduleName?: string) =>
            winstonLogger(
                `${ELASTIC_SEARCH_URL}`,
                moduleName ?? "Gateway Service",
                "debug"
            )
        this.redis = new RedisClient(this.logger)
    }

    public main(): void {
        const app = new Hono()
        const server = new GatewayServer(app)
        // this.redis.redisConnect()
        server.start(this.redis, this.logger)
    }
}

if (NODE_ENV === "production") {
    let numCPUs = Math.floor(os.availableParallelism())
    numCPUs = 5

    if (cluster.isPrimary) {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on("exit", (worker, code: number, signal: string) => {
            console.log(
                `worker process ${worker.process.pid} died, Restarting...`,
                code,
                signal
            )
            cluster.fork()
        })
    } else {
        const application = new Application()
        application.main()
    }
} else {
    const application = new Application()
    application.main()
}
