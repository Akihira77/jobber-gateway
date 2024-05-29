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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayServer = exports.socketIO = void 0;
const http_1 = __importDefault(require("http"));
require("express-async-errors");
const config_1 = require("./config");
const jobber_shared_1 = require("@Akihira77/jobber-shared");
const cookie_session_1 = __importDefault(require("cookie-session"));
const express_1 = require("express");
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const http_status_codes_1 = require("http-status-codes");
const elasticsearch_1 = require("./elasticsearch");
const routes_1 = require("./routes");
const auth_api_service_1 = require("./services/api/auth.api.service");
const axios_1 = require("axios");
const buyer_api_service_1 = require("./services/api/buyer.api.service");
const seller_api_service_1 = require("./services/api/seller.api.service");
const gig_api_service_1 = require("./services/api/gig.api.service");
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const socket_1 = require("./sockets/socket");
const chat_api_service_1 = require("./services/api/chat.api.service");
const order_api_service_1 = require("./services/api/order.api.service");
const review_api_service_1 = require("./services/api/review.api.service");
const redis_1 = require("redis");
const morgan_1 = __importDefault(require("morgan"));
const DEFAULT_ERROR_CODE = 500;
class GatewayServer {
    constructor(app) {
        this.app = app;
    }
    start() {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.startElasticSearch();
        this.errorHandler(this.app);
        this.startServer(this.app);
    }
    securityMiddleware(app) {
        app.set("trust proxy", 1);
        app.use((0, cookie_session_1.default)(Object.assign({ name: "session", keys: [`${config_1.SECRET_KEY_ONE}`, `${config_1.SECRET_KEY_TWO}`], maxAge: 7 * 24 * 36 * 10 * 1000, secure: config_1.NODE_ENV !== "development" }, (config_1.NODE_ENV !== "development" && {
            sameSite: "none"
        }))));
        app.use((0, hpp_1.default)());
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)({
            origin: [`${config_1.CLIENT_URL}`],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }));
        app.use((req, _res, next) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt) {
                auth_api_service_1.axiosAuthInstance.defaults.headers["Authorization"] =
                    `Bearer ${(_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt}`;
                buyer_api_service_1.axiosBuyerInstance.defaults.headers["Authorization"] =
                    `Bearer ${(_c = req.session) === null || _c === void 0 ? void 0 : _c.jwt}`;
                seller_api_service_1.axiosSellerInstance.defaults.headers["Authorization"] =
                    `Bearer ${(_d = req.session) === null || _d === void 0 ? void 0 : _d.jwt}`;
                gig_api_service_1.axiosGigInstance.defaults.headers["Authorization"] =
                    `Bearer ${(_e = req.session) === null || _e === void 0 ? void 0 : _e.jwt}`;
                chat_api_service_1.axiosChatInstance.defaults.headers["Authorization"] =
                    `Bearer ${(_f = req.session) === null || _f === void 0 ? void 0 : _f.jwt}`;
                order_api_service_1.axiosOrderInstance.defaults.headers["Authorization"] =
                    `Bearer ${(_g = req.session) === null || _g === void 0 ? void 0 : _g.jwt}`;
                review_api_service_1.axiosReviewInstance.defaults.headers["Authorization"] =
                    `Bearer ${(_h = req.session) === null || _h === void 0 ? void 0 : _h.jwt}`;
            }
            next();
        });
    }
    standardMiddleware(app) {
        app.use((0, compression_1.default)());
        app.use((0, express_1.json)({ limit: "200mb" }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: "200mb" }));
        app.use((0, morgan_1.default)("dev"));
    }
    routesMiddleware(app) {
        (0, routes_1.appRoutes)(app);
    }
    startElasticSearch() {
        elasticsearch_1.elasticSearch.checkConnection();
    }
    errorHandler(app) {
        app.use("*", (req, res, next) => {
            const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
            (0, config_1.logger)("server.ts - errorHandler()").error(`${fullUrl} endpoint does not exist.`, "");
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: "The endpoint called does not exist."
            });
            next();
        });
        app.use((error, _req, res, next) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (error instanceof jobber_shared_1.CustomError) {
                (0, config_1.logger)("server.ts - errorHandler()").error(`GatewayService ${error.comingFrom}:`, error);
                res.status(error.statusCode).json({
                    message: error.message
                });
            }
            else if ((0, axios_1.isAxiosError)(error)) {
                (0, config_1.logger)("server.ts - errorHandler()").error(`GatewayService Axios Error - ${(_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.comingFrom}:`, error.message);
                res.status((_e = (_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.statusCode) !== null && _e !== void 0 ? _e : DEFAULT_ERROR_CODE).json({
                    message: (_h = (_g = (_f = error === null || error === void 0 ? void 0 : error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) !== null && _h !== void 0 ? _h : "Error occurred."
                });
            }
            next();
        });
    }
    startServer(app) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const httpServer = new http_1.default.Server(app);
                const io = yield this.createSocketIO(httpServer);
                this.startHttpServer(httpServer);
                this.socketIOConnections(io);
            }
            catch (error) {
                (0, config_1.logger)("server.ts - startServer()").error("GatewayService startServer() method error:", error);
            }
        });
    }
    createSocketIO(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            const io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: [`${config_1.CLIENT_URL}`],
                    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
                }
            });
            const pubClient = (0, redis_1.createClient)({ url: `${config_1.REDIS_HOST}` });
            const subClient = pubClient.duplicate();
            yield Promise.all([pubClient.connect(), subClient.connect()]);
            io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            (0, config_1.logger)("server.ts - createSocketIO()").info("GatewayService SocketIO and Redis Pub-Sub Adapter is established.");
            exports.socketIO = io;
            return io;
        });
    }
    startHttpServer(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, config_1.logger)("server.ts - startHttpServer()").info(`GatewayService has started with pid ${process.pid}`);
                httpServer.listen(Number(config_1.PORT), () => {
                    (0, config_1.logger)("server.ts - startHttpServer()").info(`GatewayService running on port ${config_1.PORT}`);
                });
            }
            catch (error) {
                (0, config_1.logger)("server.ts - startHttpServer()").error("GatewayService startServer() method error:", error);
            }
        });
    }
    socketIOConnections(io) {
        const socketIoApp = new socket_1.SocketIOAppHandler(io);
        socketIoApp.listen();
    }
}
exports.GatewayServer = GatewayServer;
//# sourceMappingURL=server.js.map