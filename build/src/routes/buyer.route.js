"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerRoutes = void 0;
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../services/auth-middleware");
const express_1 = __importDefault(require("express"));
class BuyerRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new user_controller_1.UserController();
    }
    routes() {
        this.router.get("/buyer/email", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getBuyerByEmail);
        this.router.get("/buyer/username", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getBuyerByUsername);
        this.router.get("/buyer/:username", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getCurrentBuyer);
        return this.router;
    }
}
exports.buyerRoutes = new BuyerRoutes();
//# sourceMappingURL=buyer.route.js.map