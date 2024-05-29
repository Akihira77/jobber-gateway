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
exports.ReviewController = void 0;
const review_api_service_1 = require("../services/api/review.api.service");
const http_status_codes_1 = require("http-status-codes");
class ReviewController {
    addReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield review_api_service_1.reviewService.addReview(req.body);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: response.data.message,
                review: response.data.review
            });
        });
    }
    getReviewsByGigId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield review_api_service_1.reviewService.getReviewsByGigId(req.params.gigId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                reviews: response.data.reviews
            });
        });
    }
    getReviewsBySellerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield review_api_service_1.reviewService.getReviewsBySellerId(req.params.sellerId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                reviews: response.data.reviews
            });
        });
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map