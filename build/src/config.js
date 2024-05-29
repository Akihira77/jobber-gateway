"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.ENABLE_APM = exports.ELASTIC_APM_SERVICE_NAME = exports.ELASTIC_APM_SERVER_URL = exports.ELASTIC_APM_SECRET_TOKEN = exports.USERS_BASE_URL = exports.SECRET_KEY_TWO = exports.SECRET_KEY_ONE = exports.REVIEW_BASE_URL = exports.ORDER_BASE_URL = exports.NODE_ENV = exports.MESSAGE_BASE_URL = exports.ELASTIC_SEARCH_URL = exports.JWT_TOKEN = exports.REDIS_HOST = exports.GIG_BASE_URL = exports.GATEWAY_JWT_TOKEN = exports.CLIENT_URL = exports.AUTH_BASE_URL = exports.PORT = void 0;
const jobber_shared_1 = require("@Akihira77/jobber-shared");
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: "./.env" });
}
else {
    dotenv_1.default.config();
}
_a = process.env, exports.PORT = _a.PORT, exports.AUTH_BASE_URL = _a.AUTH_BASE_URL, exports.CLIENT_URL = _a.CLIENT_URL, exports.GATEWAY_JWT_TOKEN = _a.GATEWAY_JWT_TOKEN, exports.GIG_BASE_URL = _a.GIG_BASE_URL, exports.REDIS_HOST = _a.REDIS_HOST, exports.JWT_TOKEN = _a.JWT_TOKEN, exports.ELASTIC_SEARCH_URL = _a.ELASTIC_SEARCH_URL, exports.MESSAGE_BASE_URL = _a.MESSAGE_BASE_URL, exports.NODE_ENV = _a.NODE_ENV, exports.ORDER_BASE_URL = _a.ORDER_BASE_URL, exports.REVIEW_BASE_URL = _a.REVIEW_BASE_URL, exports.SECRET_KEY_ONE = _a.SECRET_KEY_ONE, exports.SECRET_KEY_TWO = _a.SECRET_KEY_TWO, exports.USERS_BASE_URL = _a.USERS_BASE_URL, exports.ELASTIC_APM_SECRET_TOKEN = _a.ELASTIC_APM_SECRET_TOKEN, exports.ELASTIC_APM_SERVER_URL = _a.ELASTIC_APM_SERVER_URL, exports.ELASTIC_APM_SERVICE_NAME = _a.ELASTIC_APM_SERVICE_NAME, exports.ENABLE_APM = _a.ENABLE_APM;
if (exports.NODE_ENV === "production" && exports.ENABLE_APM == "1") {
    require("elastic-apm-node").start({
        serviceName: `${exports.ELASTIC_APM_SERVICE_NAME}`,
        serverUrl: exports.ELASTIC_APM_SERVER_URL,
        secretToken: exports.ELASTIC_APM_SECRET_TOKEN,
        enironment: exports.NODE_ENV,
        active: true,
        captureBody: "all",
        errorOnAbortedRequests: true,
        captureErrorLogStackTraces: "always"
    });
}
const logger = (moduleName) => (0, jobber_shared_1.winstonLogger)(`${exports.ELASTIC_SEARCH_URL}`, moduleName !== null && moduleName !== void 0 ? moduleName : "Gateway Service", "debug");
exports.logger = logger;
//# sourceMappingURL=config.js.map