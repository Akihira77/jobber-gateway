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
exports.GatewayCache = void 0;
const config_1 = require("../config");
const redis_conection_1 = require("./redis.conection");
class GatewayCache {
    constructor() {
        this.client = redis_conection_1.redisConnection.client;
    }
    reconnectingClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client.isOpen) {
                yield this.client.connect();
            }
        });
    }
    saveUserSelectedCategory(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.reconnectingClient();
                yield this.client.SET(key, value);
            }
            catch (error) {
                (0, config_1.logger)("redis/gateway.cache.ts - saveUserSelectedCategory()").error("GatewayService Redis Cache saveUserSelectedCategory() method error:", error);
            }
        });
    }
    saveLoggedInUserToCache(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.reconnectingClient();
                const index = yield this.client.LPOS(key, value);
                if (index === null) {
                    yield this.client.LPUSH(key, value);
                    (0, config_1.logger)("redis/gateway.cache.ts - saveLoggedInUserToCache()").info(`User ${value} added to Gateway Redis Cache`);
                }
                const result = yield this.client.LRANGE(key, 0, -1);
                return result;
            }
            catch (error) {
                (0, config_1.logger)("redis/gateway.cache.ts - saveLoggedInUserToCache()").error("GatewayService Redis Cache saveLoggedInUserToCache() method error:", error);
                return [];
            }
        });
    }
    getLoggedInUsersFromCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.reconnectingClient();
                const result = yield this.client.LRANGE(key, 0, -1);
                return result;
            }
            catch (error) {
                (0, config_1.logger)("redis/gateway.cache.ts - getLoggedInUsersFromCache()").error("GatewayService Redis Cache getLoggedInUsersFromCache() method error:", error);
                return [];
            }
        });
    }
    removeLoggedInUserFromCache(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.reconnectingClient();
                yield this.client.LREM(key, 1, value);
                (0, config_1.logger)("redis/gateway.cache.ts - removeLoggedInUserFromCache()").info(`User ${value} remove from Gateway Redis Cache`);
                const result = yield this.client.LRANGE(key, 0, -1);
                return result;
            }
            catch (error) {
                (0, config_1.logger)("redis/gateway.cache.ts - removeLoggedInUserFromCache()").error("GatewayService Redis Cache removeLoggedInUserFromCache() method error:", error);
                return [];
            }
        });
    }
}
exports.GatewayCache = GatewayCache;
//# sourceMappingURL=gateway.cache.js.map