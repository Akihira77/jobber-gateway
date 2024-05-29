"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const health_route_1 = require("./routes/health.route");
const auth_route_1 = require("./routes/auth.route");
const auth_middleware_1 = require("./services/auth-middleware");
const search_route_1 = require("./routes/search.route");
const buyer_route_1 = require("./routes/buyer.route");
const seller_route_1 = require("./routes/seller.route");
const gig_route_1 = require("./routes/gig.route");
const chat_route_1 = require("./routes/chat.route");
const order_route_1 = require("./routes/order.route");
const review_route_1 = require("./routes/review.route");
const user_route_1 = require("./routes/user.route");
const BASE_PATH = "/api/gateway/v1";
const appRoutes = (app) => {
    app.use("", health_route_1.healthRoutes.routes());
    app.use(BASE_PATH, auth_route_1.authRoutes.routes());
    app.use(BASE_PATH, search_route_1.searchRoutes.routes());
    app.use(BASE_PATH, auth_middleware_1.authMiddleware.authOnly, user_route_1.userRoutes.routes());
    app.use(BASE_PATH, auth_middleware_1.authMiddleware.authOnly, buyer_route_1.buyerRoutes.routes());
    app.use(BASE_PATH, auth_middleware_1.authMiddleware.authOnly, seller_route_1.sellerRoutes.routes());
    app.use(BASE_PATH, auth_middleware_1.authMiddleware.authOnly, gig_route_1.gigRoutes.routes());
    app.use(BASE_PATH, auth_middleware_1.authMiddleware.authOnly, chat_route_1.messageRoutes.routes());
    app.use(BASE_PATH, auth_middleware_1.authMiddleware.authOnly, order_route_1.orderRoutes.routes());
    app.use(BASE_PATH, auth_middleware_1.authMiddleware.authOnly, review_route_1.reviewRoutes.routes());
};
exports.appRoutes = appRoutes;
//# sourceMappingURL=routes.js.map