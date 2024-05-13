import { GigController } from "@gateway/controllers/gig.controller";
import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";

class GigRoutes {
    private router: Router;
    private controller: GigController;

    constructor() {
        this.router = express.Router();
        this.controller = new GigController();
    }

    public routes(): Router {
        this.router.get(
            "/gig/:gigId",
            authMiddleware.verifyAuth,
            this.controller.getGigById
        );
        this.router.get(
            "/gig/seller/:sellerId",
            authMiddleware.verifyAuth,
            this.controller.getSellerActiveGigs
        );
        this.router.get(
            "/gig/seller/inactive/:sellerId",
            authMiddleware.verifyAuth,
            this.controller.getSellerInactiveGigs
        );
        this.router.get(
            "/gig/search/:from/:size/:type",
            authMiddleware.verifyAuth,
            this.controller.getGigsQuerySearch
        );
        this.router.get(
            "/gig/category/:username",
            authMiddleware.verifyAuth,
            this.controller.getGigsByCategory
        );
        this.router.get(
            "/gig/top/:username",
            authMiddleware.verifyAuth,
            this.controller.getTopRatedGigsByCategory
        );
        this.router.get(
            "/gig/similar/:gigId",
            authMiddleware.verifyAuth,
            this.controller.getGigsMoreLikeThis
        );

        this.router.post(
            "/gig/create",
            authMiddleware.verifyAuth,
            this.controller.createGig
        );

        this.router.put(
            "/gig/:gigId",
            authMiddleware.verifyAuth,
            this.controller.updateGig
        );

        this.router.put(
            "/gig/active-status/:gigId",
            authMiddleware.verifyAuth,
            this.controller.updateGigActiveStatus
        );

        this.router.delete(
            "/gig/:gigId/:sellerId",
            authMiddleware.verifyAuth,
            this.controller.deleteGig
        );

        this.router.put(
            "/gig/seed/:count",
            authMiddleware.verifyAuth,
            this.controller.populateGigs
        );
        return this.router;
    }
}

export const gigRoutes = new GigRoutes();
