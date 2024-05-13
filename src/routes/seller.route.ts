import express, { Router } from "express";
import { authMiddleware } from "@gateway/services/auth-middleware";
import { UserController } from "@gateway/controllers/user.controller";

class SellerRoutes {
    private router: Router;
    private controller: UserController;

    constructor() {
        this.router = express.Router();
        this.controller = new UserController();
    }

    public routes(): Router {
        this.router.get(
            "/seller/id/:sellerId",
            authMiddleware.verifyAuth,
            this.controller.getSellerById
        );
        this.router.get(
            "/seller/username/:username",
            authMiddleware.verifyAuth,
            this.controller.getSellerByUsername
        );
        this.router.get(
            "/seller/random/:count",
            authMiddleware.verifyAuth,
            this.controller.getRandomSellers
        );
        this.router.post(
            "/seller/create",
            authMiddleware.verifyAuth,
            this.controller.addSeller
        );
        this.router.put(
            "/seller/update/:sellerId",
            authMiddleware.verifyAuth,
            this.controller.updateSellerInfo
        );
        this.router.put(
            "/seller/seed/:count",
            authMiddleware.verifyAuth,
            this.controller.populateSeller
        );

        return this.router;
    }
}

export const sellerRoutes = new SellerRoutes();
