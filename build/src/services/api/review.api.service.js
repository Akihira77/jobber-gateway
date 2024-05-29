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
exports.reviewService = exports.axiosReviewInstance = void 0;
const axios_1 = require("../../services/axios");
const config_1 = require("../../config");
class ReviewService {
    constructor() {
        this.axiosService = new axios_1.AxiosService(`${config_1.REVIEW_BASE_URL}/api/v1/review`, "review");
        exports.axiosReviewInstance = this.axiosService.axios;
    }
    getReviewsByGigId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosReviewInstance.get(`/gig/${id}`);
            return response;
        });
    }
    getReviewsBySellerId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosReviewInstance.get(`/seller/${id}`);
            return response;
        });
    }
    addReview(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosReviewInstance.post("/", data);
            return response;
        });
    }
}
exports.reviewService = new ReviewService();
//# sourceMappingURL=review.api.service.js.map