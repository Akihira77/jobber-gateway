import { GatewayServer } from "@gateway/server"
import { Logger } from "winston"
import { winstonLogger } from "@Akihira77/jobber-shared"
import { Hono } from "hono"

import { ELASTIC_SEARCH_URL } from "./config"
import { ElasticSearchClient } from "./elasticsearch"
import { RedisClient } from "./redis/gateway.redis"
import path from "node:path"
import fs from "node:fs"
import os from "node:os"

process.on("uncaughtException", (error) => {
    console.log(error)
})

const logFilePath = path.join(process.cwd(), "/usage.txt")

function getCPUUsage() {
    const cpuUsage = process.cpuUsage()
    const userCPUTime = (cpuUsage.user / 1000).toFixed(2) // dalam milidetik
    const systemCPUTime = (cpuUsage.system / 1000).toFixed(2) // dalam milidetik

    return {
        user: userCPUTime,
        system: systemCPUTime
    }
}

function getMemoryUsage() {
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory

    return {
        total: (totalMemory / (1024 * 1024)).toFixed(2), // in MB
        used: (usedMemory / (1024 * 1024)).toFixed(2), // in MB
        free: (freeMemory / (1024 * 1024)).toFixed(2) // in MB
    }
}

// Fungsi untuk mencatat penggunaan CPU dan memori ke file log
function logUsage() {
    const cpuUsage = getCPUUsage()
    const memoryUsage = getMemoryUsage()
    const timestamp = new Date().toISOString()

    const logMessage = `${timestamp} - CPU Usage: User: ${cpuUsage.user}ms Sys: ${cpuUsage.system}ms | Memory Total: ${memoryUsage.total}MB Used: ${memoryUsage.used}MB Free: ${memoryUsage.free}MB\n`

    // Tambahkan pesan log ke file log
    fs.appendFile(logFilePath, logMessage, (err: unknown) => {
        if (err) {
            console.log(err)
        }
    })
}

class Application {
    private logger: (moduleName: string) => Logger
    private elastic: ElasticSearchClient
    private redis: RedisClient
    constructor() {
        this.logger = (moduleName?: string) =>
            winstonLogger(
                `${ELASTIC_SEARCH_URL}`,
                moduleName ?? "Gateway Service",
                "debug"
            )
        this.elastic = new ElasticSearchClient(this.logger)
        this.redis = new RedisClient(this.logger)
    }

    public main(): void {
        const app = new Hono()
        const server = new GatewayServer(app)
        this.redis.redisConnect()
        server.start(this.elastic, this.redis, this.logger)
    }
}

const application = new Application()
application.main()
setInterval(logUsage, 60 * 1000)
