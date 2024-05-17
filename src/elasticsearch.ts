import { ELASTIC_SEARCH_URL, logger } from "@gateway/config";
import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";

class ElasticSearch {
    private elasticSearchClient: Client;

    constructor() {
        this.elasticSearchClient = new Client({
            node: `${ELASTIC_SEARCH_URL}`
        });
    }

    public async checkConnection(): Promise<void> {
        let isConnected = false;
        while (!isConnected) {
            logger("elasticsearch.ts - checkConnection()").info(
                "GatewayService Connecting to ElasticSearch"
            );
            try {
                const health: ClusterHealthResponse =
                    await this.elasticSearchClient.cluster.health({});
                logger("elasticsearch.ts - checkConnection()").info(
                    `GatewayService ElasticSearch health status - ${health.status}`
                );

                if (health.status !== "RED") {
                    isConnected = true;
                }
            } catch (error) {
                logger("elasticsearch.ts - checkConnection()").error(
                    "Connection to ElasticSearch failed, Retrying..."
                );
                logger("elasticsearch.ts - checkConnection()").error(
                    "GatewayService checkConnection() method error:",
                    error
                );
            }
        }
    }
}

export const elasticSearch = new ElasticSearch();
