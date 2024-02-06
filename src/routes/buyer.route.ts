import { Get } from "@gateway/controllers/users/buyer/get";
import express, { Router } from "express";

class BuyerRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get("/buyer/email", Get.prototype.byEmail);
        this.router.get("/buyer/username", Get.prototype.byCurrentUsername);
        this.router.get("/buyer/:username", Get.prototype.byUsername);

        return this.router;
    }
}

export const buyerRoutes = new BuyerRoutes();
