import { CurrentUser } from "@gateway/controllers/auth/currentUser";
import { Refresh } from "@gateway/controllers/auth/refreshToken";
import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";

class UserRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get(
            "/auth/current-user",
            authMiddleware.checkAuthentication,
            CurrentUser.prototype.get
        );
        this.router.get(
            "/auth/refresh-token/:username",
            authMiddleware.checkAuthentication,
            Refresh.prototype.token
        );
        this.router.post(
            "/auth/resend-verification-email",
            authMiddleware.checkAuthentication,
            CurrentUser.prototype.resendVerificationEmail
        );

        return this.router;
    }
}

export const userRoutes = new UserRoutes();
