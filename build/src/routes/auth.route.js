"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../services/auth-middleware");
const express_1 = __importDefault(require("express"));
class AuthRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new auth_controller_1.AuthController();
    }
    routes() {
        this.router.post("/auth/signup", this.controller.signUp);
        this.router.post("/auth/signin", this.controller.signIn);
        this.router.put("/auth/signout", this.controller.signOut);
        this.router.put("/auth/verify-email", this.controller.verifyEmail);
        this.router.put("/auth/forgot-password", this.controller.forgotPassword);
        this.router.put("/auth/reset-password/:token", this.controller.resetPassword);
        this.router.put("/auth/change-password", auth_middleware_1.authMiddleware.verifyAuth, this.controller.changePassword);
        this.router.put("/auth/seed/:count", this.controller.populateAuth);
        return this.router;
    }
}
exports.authRoutes = new AuthRoutes();
//# sourceMappingURL=auth.route.js.map