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
exports.authService = exports.axiosAuthInstance = void 0;
const axios_1 = require("../../services/axios");
const config_1 = require("../../config");
class AuthService {
    constructor() {
        this.axiosService = new axios_1.AxiosService(`${config_1.AUTH_BASE_URL}/api/v1/auth`, "auth");
        exports.axiosAuthInstance = this.axiosService.axios;
    }
    getCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosAuthInstance.get("/current-user");
            return response;
        });
    }
    getRefreshToken(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosAuthInstance.get(`/refresh-token/${username}`);
            return response;
        });
    }
    resendEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosAuthInstance.post("/resend-verification-email", request);
            return response;
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosAuthInstance.put("/verify-email", { token });
            return response;
        });
    }
    changePassword(currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosAuthInstance.put("/change-password", { currentPassword, newPassword });
            return response;
        });
    }
    signUp(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosService.axios.post("/signup", request);
            return response;
        });
    }
    signIn(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosService.axios.post("/signin", request);
            return response;
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosService.axios.put("/forgot-password", { email });
            return response;
        });
    }
    resetPassword(token, password, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosService.axios.put(`/reset-password/${token}`, { password, confirmPassword });
            return response;
        });
    }
    getGigs(query, from, size, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosService.axios.get(`/search/gig/${from}/${size}/${type}?${query}`);
            return response;
        });
    }
    getGigById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosService.axios.get(`/search/gig/${id}`);
            return response;
        });
    }
    seed(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosService.axios.put(`/seed/${count}`);
            return response;
        });
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.api.service.js.map