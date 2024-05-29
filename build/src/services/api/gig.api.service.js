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
exports.gigService = exports.axiosGigInstance = void 0;
const axios_1 = require("../../services/axios");
const config_1 = require("../../config");
class GigService {
    constructor() {
        this.axiosService = new axios_1.AxiosService(`${config_1.GIG_BASE_URL}/api/v1/gig`, "gig");
        exports.axiosGigInstance = this.axiosService.axios;
    }
    getGigById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.get(`/${id}`);
            return response;
        });
    }
    getSellerActiveGigs(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.get(`/seller/${sellerId}`);
            return response;
        });
    }
    getSellerInactiveGigs(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.get(`/seller/inactive/${sellerId}`);
            return response;
        });
    }
    getGigsByCategory(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.get(`/category/${username}`);
            return response;
        });
    }
    getMoreGigsLikeThis(gigId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.get(`/similar/${gigId}`);
            return response;
        });
    }
    getTopRatedGigsByCategory(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.get(`/top/${username}`);
            return response;
        });
    }
    searchGigs(query, from, size, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.get(`/search/${from}/${size}/${type}?${query}`);
            return response;
        });
    }
    createGig(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.post("/create", request);
            return response;
        });
    }
    updateGig(gigId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.put(`/update/${gigId}`, request);
            return response;
        });
    }
    updateGigActiveStatus(gigId, active) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.put(`/status/${gigId}`, {
                active
            });
            return response;
        });
    }
    deleteGig(gigId, sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.delete(`/${gigId}/${sellerId}`);
            return response;
        });
    }
    seed(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosGigInstance.put(`/seed/${count}`);
            return response;
        });
    }
}
exports.gigService = new GigService();
//# sourceMappingURL=gig.api.service.js.map