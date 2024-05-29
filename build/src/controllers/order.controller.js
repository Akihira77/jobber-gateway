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
exports.OrderController = void 0;
const order_api_service_1 = require("../services/api/order.api.service");
const http_status_codes_1 = require("http-status-codes");
class OrderController {
    getOrderByOrderId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.getOrderByOrderId(req.params.orderId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                order: response.data.order
            });
        });
    }
    getSellerOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.getOrdersBySellerId(req.params.orderId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                orders: response.data.orders
            });
        });
    }
    gerBuyerOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.getOrdersByBuyerId(req.params.orderId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                orders: response.data.orders
            });
        });
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.getNotifications(req.params.userTo);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                notifications: response.data.notifications
            });
        });
    }
    createOrderIntent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.createOrderIntent(req.body.buyerId, req.body.price);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: response.data.message,
                clientSecret: response.data.clientSecret,
                paymentIntentId: response.data.paymentIntentId
            });
        });
    }
    buyerCreateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.createOrder(req.body);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: response.data.message,
                order: response.data.order
            });
        });
    }
    sellerCancelOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.cancelOrder(req.params.orderId, req.body.orderData, req.body.paymentIntentId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message
            });
        });
    }
    sellerRequestDeliveryDateExtension(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.requestDeliveryDateExtension(req.params.orderId, req.body);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                order: response.data.order
            });
        });
    }
    updateDeliveryDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.updateDeliveryDate(req.params.type, req.params.orderId, req.body);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                order: response.data.order
            });
        });
    }
    buyerApproveOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.approveOrder(req.params.orderId, req.body);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                order: response.data.order
            });
        });
    }
    sellerDeliverOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.deliverOrder(req.params.orderId, req.body);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                order: response.data.order
            });
        });
    }
    markNotificationAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield order_api_service_1.orderService.markNotificationAsRead(req.body.notificationId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                notification: response.data.notification
            });
        });
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map