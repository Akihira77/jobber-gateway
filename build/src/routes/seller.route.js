"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../services/auth-middleware");
const user_controller_1 = require("../controllers/user.controller");
class SellerRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new user_controller_1.UserController();
    }
    routes() {
        this.router.get("/seller/id/:sellerId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getSellerById);
        this.router.get("/seller/username/:username", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getSellerByUsername);
        this.router.get("/seller/random/:count", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getRandomSellers);
        this.router.post("/seller/create", auth_middleware_1.authMiddleware.verifyAuth, this.controller.addSeller);
        this.router.put("/seller/update/:sellerId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.updateSellerInfo);
        this.router.put("/seller/seed/:count", auth_middleware_1.authMiddleware.verifyAuth, this.controller.populateSeller);
        return this.router;
    }
}
exports.sellerRoutes = new SellerRoutes();
//# sourceMappingURL=seller.route.js.map