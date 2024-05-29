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
exports.sellerService = exports.axiosSellerInstance = void 0;
const axios_1 = require("../../services/axios");
const config_1 = require("../../config");
class SellerService {
    constructor() {
        this.axiosService = new axios_1.AxiosService(`${config_1.USERS_BASE_URL}/api/v1/seller`, "seller");
        exports.axiosSellerInstance = this.axiosService.axios;
    }
    getSellerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosSellerInstance.get(`/id/${id}`);
            return response;
        });
    }
    getSellerByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosSellerInstance.get(`/username/${username}`);
            return response;
        });
    }
    getRandomSellers(count) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(axiosSellerInstance.getUri() + "/random/" + count);
            const response = yield exports.axiosSellerInstance.get(`/random/${count}`);
            return response;
        });
    }
    createSeller(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosSellerInstance.post("/create", request);
            return response;
        });
    }
    updateSeller(sellerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosSellerInstance.put(`/${sellerId}`, request);
            return response;
        });
    }
    seed(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosSellerInstance.put(`/seed/${count}`);
            return response;
        });
    }
}
exports.sellerService = new SellerService();
//# sourceMappingURL=seller.api.service.js.map