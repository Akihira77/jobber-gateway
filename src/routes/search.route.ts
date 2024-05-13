import { AuthController } from "@gateway/controllers/auth.controller";
import express, { Router } from "express";

class SearchRoutes {
    private router: Router;
    private contoller: AuthController;

    constructor() {
        this.router = express.Router();
        this.contoller = new AuthController();
    }

    public routes(): Router {
        this.router.get(
            "/auth/search/gig/:from/:size/:type",
            this.contoller.getGigsQuerySearch
        );
        this.router.get("/auth/search/gig/:id", this.contoller.getGigById);

        return this.router;
    }
}

export const searchRoutes = new SearchRoutes();
