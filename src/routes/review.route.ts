import { Create } from "@gateway/controllers/review/create";
import { Get } from "@gateway/controllers/review/get";
import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";

class ReviewRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get(
            "/review/:gigId",
            authMiddleware.checkAuthentication,
            Get.prototype.reviewsByGigId
        );
        this.router.get(
            "/review/:sellerId",
            authMiddleware.checkAuthentication,
            Get.prototype.reviewsBySellerId
        );

        this.router.post(
            "/review",
            authMiddleware.checkAuthentication,
            Create.prototype.review
        );

        return this.router;
    }
}

export const reviewRoutes = new ReviewRoutes();
