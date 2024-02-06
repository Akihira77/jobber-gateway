import { Get } from "@gateway/controllers/users/seller/get";
import express, { Router } from "express";
import { Create } from "@gateway/controllers/users/seller/create";
import { Update } from "@gateway/controllers/users/seller/update";
import { Seed } from "@gateway/controllers/users/seller/seed";

class SellerRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get("/seller/id/:sellerId", Get.prototype.byId);
        this.router.get("/seller/username/:username", Get.prototype.byUsername);
        this.router.get("/seller/random/:count", Get.prototype.randomSellers);
        this.router.post("/seller/create", Create.prototype.seller);
        this.router.put("/seller/update/:sellerId", Update.prototype.seller);
        this.router.put("/seller/seed/:count", Seed.prototype.seller);

        return this.router;
    }
}

export const sellerRoutes = new SellerRoutes();
