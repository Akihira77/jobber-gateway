import { AuthController } from "@gateway/controllers/auth.controller";
import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";

class UserRoutes {
    private router: Router;
    private controller: AuthController;

    constructor() {
        this.router = express.Router();
        this.controller = new AuthController();
    }

    public routes(): Router {
        this.router.get(
            "/auth/current-user",
            authMiddleware.verifyAuth,
            this.controller.getCurrentUser
        );
        this.router.get(
            "/auth/logged-in-user",
            authMiddleware.verifyAuth,
            this.controller.getLoggedInUsers
        );
        this.router.get(
            "/auth/refresh-token/:username",
            authMiddleware.verifyAuth,
            this.controller.getRefreshToken
        );

        this.router.post(
            "/auth/resend-verification-email",
            authMiddleware.verifyAuth,
            this.controller.resendVerificationEmail
        );

        this.router.delete(
            "/auth/logged-in-user/:username",
            authMiddleware.verifyAuth,
            this.controller.removeLoggedInUsers
        );

        return this.router;
    }
}

export const userRoutes = new UserRoutes();
