"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const gateway_cache_1 = require("../redis/gateway.cache");
const server_1 = require("../server");
const auth_api_service_1 = require("../services/api/auth.api.service");
const http_status_codes_1 = require("http-status-codes");
class AuthController {
    constructor() {
        this.gatewayCache = new gateway_cache_1.GatewayCache();
    }
    getCurrentUser(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.getCurrentUser();
            const { message, user } = response.data;
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message,
                user
            });
        });
    }
    resendVerificationEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.resendEmail(req.body);
            const { message, user } = response.data;
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message,
                user
            });
        });
    }
    getLoggedInUsers(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.gatewayCache.getLoggedInUsersFromCache("loggedInUsers");
            server_1.socketIO.emit("online", response);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "User is online"
            });
        });
    }
    removeLoggedInUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.gatewayCache.removeLoggedInUserFromCache("loggedInUsers", req.params.username);
            server_1.socketIO.emit("online", response);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "User is offline"
            });
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.forgotPassword(req.body.email);
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: response.data.message });
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, confirmPassword } = req.body;
            const response = yield auth_api_service_1.authService.resetPassword(req.params.token, password, confirmPassword);
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: response.data.message });
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword, currentPassword } = req.body;
            const response = yield auth_api_service_1.authService.changePassword(currentPassword, newPassword);
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: response.data.message });
        });
    }
    getRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.getRefreshToken(req.params.username);
            const { token, message, user } = response.data;
            req.session = {
                jwt: token
            };
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message,
                user
            });
        });
    }
    getGigById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.getGigById(req.params.id);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gig: response.data.gig
            });
        });
    }
    getGigsQuerySearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from, size, type } = req.params;
            let query = "";
            const objList = Object.entries(req.query);
            const lastItemIndex = objList.length - 1;
            objList.forEach(([key, value], index) => {
                query += `${key}=${value}${index !== lastItemIndex ? "&" : ""}`;
            });
            const response = yield auth_api_service_1.authService.getGigs(query, from, size, type);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                total: response.data.total,
                gigs: response.data.gigs
            });
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.signIn(req.body);
            const { token, message, user } = response.data;
            req.session = {
                jwt: token
            };
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message,
                user
            });
        });
    }
    signOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session = null;
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Logout successful",
                user: {}
            });
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.signUp(req.body);
            const { token, message, user } = response.data;
            req.session = {
                jwt: token
            };
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message,
                user
            });
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.verifyEmail(req.body.token);
            const { message, user } = response.data;
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message,
                user
            });
        });
    }
    populateAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield auth_api_service_1.authService.seed(req.params.count);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message
            });
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map