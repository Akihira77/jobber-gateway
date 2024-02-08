import { Get } from "@gateway/controllers/users/seller/get";
import express, { Router } from "express";
import { Create } from "@gateway/controllers/users/seller/create";
import { Update } from "@gateway/controllers/users/seller/update";
import { Seed } from "@gateway/controllers/users/seller/seed";
import { authMiddleware } from "@gateway/services/auth-middleware";

class SellerRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get(
            "/seller/id/:sellerId",
            authMiddleware.checkAuthentication,
            Get.prototype.byId
        );
        this.router.get(
            "/seller/username/:username",
            authMiddleware.checkAuthentication,
            Get.prototype.byUsername
        );
        this.router.get(
            "/seller/random/:count",
            authMiddleware.checkAuthentication,
            Get.prototype.randomSellers
        );
        this.router.post(
            "/seller/create",
            authMiddleware.checkAuthentication,
            Create.prototype.seller
        );
        this.router.put(
            "/seller/update/:sellerId",
            authMiddleware.checkAuthentication,
            Update.prototype.seller
        );
        this.router.put(
            "/seller/seed/:count",
            authMiddleware.checkAuthentication,
            Seed.prototype.seller
        );

        return this.router;
    }
}

export const sellerRoutes = new SellerRoutes();
