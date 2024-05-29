"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jobber_shared_1 = require("@Akihira77/jobber-shared");
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthMiddleware {
    authOnly(req, _res, next) {
        var _a, _b;
        if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
            throw new jobber_shared_1.NotAuthorizedError("Token is not available. Please login again", "GatewayService verifyUser() method error");
        }
        try {
            const payload = jsonwebtoken_1.default.verify((_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt, `${config_1.JWT_TOKEN}`, {
                algorithms: ["HS512"]
            });
            req.currentUser = payload;
        }
        catch (error) {
            throw new jobber_shared_1.NotAuthorizedError("Token is not correct. Please login again", "GatewayService verifyUser() method invalid session error");
        }
        next();
    }
    verifyAuth(req, _res, next) {
        if (!req.currentUser) {
            throw new jobber_shared_1.BadRequestError("Authentication is required to access this route", "GatewayService checkAuthentication() method error");
        }
        next();
    }
}
exports.authMiddleware = new AuthMiddleware();
//# sourceMappingURL=auth-middleware.js.map