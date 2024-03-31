import { Create } from "@gateway/controllers/gig/create";
import { Delete } from "@gateway/controllers/gig/delete";
import { Get } from "@gateway/controllers/gig/get";
import { Search } from "@gateway/controllers/gig/search";
import { GigSeed } from "@gateway/controllers/gig/seed";
import { Update } from "@gateway/controllers/gig/update";
import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";

class GigRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get(
            "/gig/:gigId",
            authMiddleware.checkAuthentication,
            Get.prototype.gigById
        );
        this.router.get(
            "/gig/seller/:sellerId",
            authMiddleware.checkAuthentication,
            Get.prototype.sellerActiveGigs
        );
        this.router.get(
            "/gig/seller/inactive/:sellerId",
            authMiddleware.checkAuthentication,
            Get.prototype.sellerInactiveGigs
        );
        this.router.get(
            "/gig/search/:from/:size/:type",
            authMiddleware.checkAuthentication,
            Search.prototype.gigQuerySearch
        );
        this.router.get(
            "/gig/category/:username",
            authMiddleware.checkAuthentication,
            Get.prototype.gigsByCategory
        );
        this.router.get(
            "/gig/top/:username",
            authMiddleware.checkAuthentication,
            Get.prototype.topRatedGigsByCategory
        );
        this.router.get(
            "/gig/similar/:gigId",
            authMiddleware.checkAuthentication,
            Get.prototype.gigsMoreLikeThis
        );

        this.router.post(
            "/gig/create",
            authMiddleware.checkAuthentication,
            Create.prototype.gig
        );

        this.router.put(
            "/gig/seed/:count",
            authMiddleware.checkAuthentication,
            GigSeed.prototype.generate
        );
        this.router.put(
            "/gig/:gigId",
            authMiddleware.checkAuthentication,
            Update.prototype.gig
        );
        this.router.put(
            "/gig/active-status/:gigId",
            authMiddleware.checkAuthentication,
            Update.prototype.gigActiveStatus
        );

        this.router.delete(
            "/gig/:gigId/:sellerId",
            authMiddleware.checkAuthentication,
            Delete.prototype.gig
        );

        return this.router;
    }
}

export const gigRoutes = new GigRoutes();
