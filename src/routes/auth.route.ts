import { AuthController } from "@gateway/controllers/auth.controller";
import { RedisClient } from "@gateway/redis/gateway.redis";
import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";

export class AuthRoutes {
    private router: Router;
    private controller: AuthController;

    constructor(redis: RedisClient) {
        this.router = express.Router();
        this.controller = new AuthController(redis);
    }

    public routes(): Router {
        this.router.post("/auth/signup", this.controller.signUp);
        this.router.post("/auth/signin", this.controller.signIn);
        this.router.put("/auth/signout", this.controller.signOut);
        this.router.put("/auth/verify-email", this.controller.verifyEmail);
        this.router.put(
            "/auth/forgot-password",
            this.controller.forgotPassword
        );
        this.router.put(
            "/auth/reset-password/:token",
            this.controller.resetPassword
        );
        this.router.put(
            "/auth/change-password",
            authMiddleware.verifyAuth,
            this.controller.changePassword
        );
        this.router.put("/auth/seed/:count", this.controller.populateAuth);

        return this.router;
    }
}
