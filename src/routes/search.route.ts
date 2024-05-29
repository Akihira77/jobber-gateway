import { AuthController } from "@gateway/controllers/auth.controller";
import { RedisClient } from "@gateway/redis/gateway.redis";
import express, { Router } from "express";

export class SearchRoutes {
    private router: Router;
    private controller: AuthController;

    constructor(redis: RedisClient) {
        this.router = express.Router();
        this.controller = new AuthController(redis);
    }

    public routes(): Router {
        this.router.get(
            "/auth/search/gig/:from/:size/:type",
            this.controller.getGigsQuerySearch
        );
        this.router.get("/auth/search/gig/:id", this.controller.getGigById);

        return this.router;
    }
}
