"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../services/auth-middleware");
const express_1 = __importDefault(require("express"));
class ReviewRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new review_controller_1.ReviewController();
    }
    routes() {
        this.router.get("/review/gig/:gigId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getReviewsByGigId);
        this.router.get("/review/seller/:sellerId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getReviewsBySellerId);
        this.router.post("/review", auth_middleware_1.authMiddleware.verifyAuth, this.controller.addReview);
        return this.router;
    }
}
exports.reviewRoutes = new ReviewRoutes();
//# sourceMappingURL=review.route.js.map