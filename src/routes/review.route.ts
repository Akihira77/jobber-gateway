import { ReviewController } from "@gateway/controllers/review.controller";
import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";

class ReviewRoutes {
    private router: Router;
    private controller: ReviewController;

    constructor() {
        this.router = express.Router();
        this.controller = new ReviewController();
    }

    public routes(): Router {
        this.router.get(
            "/review/gig/:gigId",
            authMiddleware.verifyAuth,
            this.controller.getReviewsByGigId
        );
        this.router.get(
            "/review/seller/:sellerId",
            authMiddleware.verifyAuth,
            this.controller.getReviewsBySellerId
        );

        this.router.post(
            "/review",
            authMiddleware.verifyAuth,
            this.controller.addReview
        );

        return this.router;
    }
}

export const reviewRoutes = new ReviewRoutes();
