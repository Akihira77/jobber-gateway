import { UserController } from "@gateway/controllers/user.controller";
import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";

class BuyerRoutes {
    private router: Router;
    private controller: UserController;

    constructor() {
        this.router = express.Router();
        this.controller = new UserController();
    }

    public routes(): Router {
        this.router.get(
            "/buyer/email",
            authMiddleware.verifyAuth,
            this.controller.getBuyerByEmail
        );
        this.router.get(
            "/buyer/username",
            authMiddleware.verifyAuth,
            this.controller.getBuyerByUsername
        );
        this.router.get(
            "/buyer/:username",
            authMiddleware.verifyAuth,
            this.controller.getCurrentBuyer
        );

        return this.router;
    }
}

export const buyerRoutes = new BuyerRoutes();
