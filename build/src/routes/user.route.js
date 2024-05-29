"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../services/auth-middleware");
const express_1 = __importDefault(require("express"));
class UserRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new auth_controller_1.AuthController();
    }
    routes() {
        this.router.get("/auth/current-user", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getCurrentUser);
        this.router.get("/auth/logged-in-user", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getLoggedInUsers);
        this.router.get("/auth/refresh-token/:username", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getRefreshToken);
        this.router.post("/auth/resend-verification-email", auth_middleware_1.authMiddleware.verifyAuth, this.controller.resendVerificationEmail);
        this.router.delete("/auth/logged-in-user/:username", auth_middleware_1.authMiddleware.verifyAuth, this.controller.removeLoggedInUsers);
        return this.router;
    }
}
exports.userRoutes = new UserRoutes();
//# sourceMappingURL=user.route.js.map