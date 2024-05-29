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
exports.elasticSearch = void 0;
const config_1 = require("./config");
const elasticsearch_1 = require("@elastic/elasticsearch");
class ElasticSearch {
    constructor() {
        this.elasticSearchClient = new elasticsearch_1.Client({
            node: `${config_1.ELASTIC_SEARCH_URL}`
        });
    }
    checkConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            let isConnected = false;
            while (!isConnected) {
                (0, config_1.logger)("elasticsearch.ts - checkConnection()").info("GatewayService Connecting to ElasticSearch");
                try {
                    const health = yield this.elasticSearchClient.cluster.health({});
                    (0, config_1.logger)("elasticsearch.ts - checkConnection()").info(`GatewayService ElasticSearch health status - ${health.status}`);
                    if (health.status !== "RED") {
                        isConnected = true;
                    }
                }
                catch (error) {
                    (0, config_1.logger)("elasticsearch.ts - checkConnection()").error("Connection to ElasticSearch failed, Retrying...");
                    (0, config_1.logger)("elasticsearch.ts - checkConnection()").error("GatewayService checkConnection() method error:", error);
                }
            }
        });
    }
}
exports.elasticSearch = new ElasticSearch();
//# sourceMappingURL=elasticsearch.js.map