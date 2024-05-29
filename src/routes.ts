import { Application } from "express";
import { healthRoutes } from "@gateway/routes/health.route";
import { authMiddleware } from "@gateway/services/auth-middleware";
import { SearchRoutes } from "@gateway/routes/search.route";
import { buyerRoutes } from "@gateway/routes/buyer.route";
import { sellerRoutes } from "@gateway/routes/seller.route";
import { gigRoutes } from "@gateway/routes/gig.route";
import { messageRoutes } from "@gateway/routes/chat.route";
import { orderRoutes } from "@gateway/routes/order.route";
import { reviewRoutes } from "@gateway/routes/review.route";

import { UserRoutes } from "./routes/user.route";
import { RedisClient } from "./redis/gateway.redis";
import { AuthRoutes } from "./routes/auth.route";

const BASE_PATH = "/api/gateway/v1";

export const appRoutes = (app: Application, redis: RedisClient) => {
    const authRoutes = new AuthRoutes(redis);
    const userRoutes = new UserRoutes(redis);
    const searchRoutes = new SearchRoutes(redis);

    app.use("", healthRoutes.routes());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, searchRoutes.routes());

    app.use(BASE_PATH, authMiddleware.authOnly, userRoutes.routes());
    app.use(BASE_PATH, authMiddleware.authOnly, buyerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.authOnly, sellerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.authOnly, gigRoutes.routes());
    app.use(BASE_PATH, authMiddleware.authOnly, messageRoutes.routes());
    app.use(BASE_PATH, authMiddleware.authOnly, orderRoutes.routes());
    app.use(BASE_PATH, authMiddleware.authOnly, reviewRoutes.routes());
};
