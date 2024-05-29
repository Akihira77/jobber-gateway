"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gigRoutes = void 0;
const gig_controller_1 = require("../controllers/gig.controller");
const auth_middleware_1 = require("../services/auth-middleware");
const express_1 = __importDefault(require("express"));
class GigRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new gig_controller_1.GigController();
    }
    routes() {
        this.router.get("/gig/:gigId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getGigById);
        this.router.get("/gig/seller/:sellerId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getSellerActiveGigs);
        this.router.get("/gig/seller/inactive/:sellerId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getSellerInactiveGigs);
        this.router.get("/gig/search/:from/:size/:type", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getGigsQuerySearch);
        this.router.get("/gig/category/:username", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getGigsByCategory);
        this.router.get("/gig/top/:username", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getTopRatedGigsByCategory);
        this.router.get("/gig/similar/:gigId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getGigsMoreLikeThis);
        this.router.post("/gig/create", auth_middleware_1.authMiddleware.verifyAuth, this.controller.createGig);
        this.router.put("/gig/:gigId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.updateGig);
        this.router.put("/gig/active-status/:gigId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.updateGigActiveStatus);
        this.router.delete("/gig/:gigId/:sellerId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.deleteGig);
        this.router.put("/gig/seed/:count", auth_middleware_1.authMiddleware.verifyAuth, this.controller.populateGigs);
        return this.router;
    }
}
exports.gigRoutes = new GigRoutes();
//# sourceMappingURL=gig.route.js.map