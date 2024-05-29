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
exports.GigController = void 0;
const gig_api_service_1 = require("../services/api/gig.api.service");
const http_status_codes_1 = require("http-status-codes");
class GigController {
    createGig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.createGig(req.body);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: response.data.message,
                gig: response.data.gig
            });
        });
    }
    deleteGig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.deleteGig(req.params.gigId, req.params.sellerId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message
            });
        });
    }
    getGigById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.getGigById(req.params.gigId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gig: response.data.gig
            });
        });
    }
    getGigsByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.getGigsByCategory(req.params.username);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gigs: response.data.gigs
            });
        });
    }
    getSellerActiveGigs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.getSellerActiveGigs(req.params.sellerId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gigs: response.data.gigs
            });
        });
    }
    getSellerInactiveGigs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.getSellerInactiveGigs(req.params.sellerId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gigs: response.data.gigs
            });
        });
    }
    getGigsMoreLikeThis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.getMoreGigsLikeThis(req.params.gigId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gigs: response.data.gigs
            });
        });
    }
    getTopRatedGigsByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.getTopRatedGigsByCategory(req.params.username);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gigs: response.data.gigs
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
            const response = yield gig_api_service_1.gigService.searchGigs(`${query}`, from, size, type);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                total: response.data.total,
                gigs: response.data.gigs
            });
        });
    }
    updateGig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.updateGig(req.params.gigId, req.body);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gig: response.data.gig
            });
        });
    }
    updateGigActiveStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.updateGigActiveStatus(req.params.gigId, req.body.active);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                gig: response.data.gig
            });
        });
    }
    populateGigs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield gig_api_service_1.gigService.seed(req.params.count);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message
            });
        });
    }
}
exports.GigController = GigController;
//# sourceMappingURL=gig.controller.js.map