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
exports.buyerService = exports.axiosBuyerInstance = void 0;
const axios_1 = require("../../services/axios");
const config_1 = require("../../config");
class BuyerService {
    constructor() {
        this.axiosService = new axios_1.AxiosService(`${config_1.USERS_BASE_URL}/api/v1/buyer`, "buyer");
        exports.axiosBuyerInstance = this.axiosService.axios;
    }
    getCurrentBuyerByUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosBuyerInstance.get("/username");
            return response;
        });
    }
    getBuyerByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosBuyerInstance.get(`${username}`);
            return response;
        });
    }
    getBuyerByEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosBuyerInstance.get("/email");
            return response;
        });
    }
}
exports.buyerService = new BuyerService();
//# sourceMappingURL=buyer.api.service.js.map