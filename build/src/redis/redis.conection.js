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
exports.redisConnection = void 0;
const redis_1 = require("redis");
const config_1 = require("../config");
class RedisConnection {
    constructor() {
        this.client = (0, redis_1.createClient)({ url: `${config_1.REDIS_HOST}` });
    }
    redisConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                (0, config_1.logger)("redis/redis.connection.ts - redisConnect()").info(`GatewayService Redis Connected: ${this.client.isReady}`);
                this.catchError();
            }
            catch (error) {
                (0, config_1.logger)("redis/redis.connection.ts - redisConnect()").error("GatewayService redisConnect() method error:", error);
            }
        });
    }
    catchError() {
        this.client.on("error", (error) => {
            (0, config_1.logger)("redis/redis.connection.ts - catchError()").error(error);
        });
    }
}
exports.redisConnection = new RedisConnection();
//# sourceMappingURL=redis.conection.js.map