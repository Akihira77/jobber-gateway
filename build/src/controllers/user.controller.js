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
exports.UserController = void 0;
const buyer_api_service_1 = require("../services/api/buyer.api.service");
const seller_api_service_1 = require("../services/api/seller.api.service");
const http_status_codes_1 = require("http-status-codes");
class UserController {
    getBuyerByEmail(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield buyer_api_service_1.buyerService.getBuyerByEmail();
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                buyer: response.data.buyer
            });
        });
    }
    getCurrentBuyer(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield buyer_api_service_1.buyerService.getCurrentBuyerByUsername();
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                buyer: response.data.buyer
            });
        });
    }
    getBuyerByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield buyer_api_service_1.buyerService.getBuyerByUsername(req.params.username);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                buyer: response.data.buyer
            });
        });
    }
    getSellerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield seller_api_service_1.sellerService.getSellerById(req.params.sellerId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                seller: response.data.seller
            });
        });
    }
    getSellerByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield seller_api_service_1.sellerService.getSellerByUsername(req.params.username);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                seller: response.data.seller
            });
        });
    }
    getRandomSellers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield seller_api_service_1.sellerService.getRandomSellers(req.params.count);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                sellers: response.data.sellers
            });
        });
    }
    addSeller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield seller_api_service_1.sellerService.createSeller(req.body);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: response.data.message,
                seller: response.data.seller
            });
        });
    }
    updateSellerInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield seller_api_service_1.sellerService.updateSeller(req.params.sellerId, req.body);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                seller: response.data.seller
            });
        });
    }
    populateSeller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield seller_api_service_1.sellerService.seed(req.params.count);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message
            });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map