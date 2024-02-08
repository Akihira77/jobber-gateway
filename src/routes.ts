import { Application } from "express";
import { healthRoutes } from "@gateway/routes/health.route";
import { authRoutes } from "@gateway/routes/auth.route";
import { userRoutes } from "@gateway/routes/user.route";
import { authMiddleware } from "@gateway/services/auth-middleware";
import { searchRoutes } from "@gateway/routes/search.route";
import { buyerRoutes } from "@gateway/routes/buyer.route";
import { sellerRoutes } from "@gateway/routes/seller.route";
import { gigRoutes } from "@gateway/routes/gig.route";

const BASE_PATH = "/api/gateway/v1";

export const appRoutes = (app: Application) => {
    app.use("", healthRoutes.routes());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, searchRoutes.routes());

    app.use(BASE_PATH, authMiddleware.verifyUser, userRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, gigRoutes.routes());
};
