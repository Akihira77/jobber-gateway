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
exports.orderService = exports.axiosOrderInstance = void 0;
const axios_1 = require("../../services/axios");
const config_1 = require("../../config");
class OrderService {
    constructor() {
        this.axiosService = new axios_1.AxiosService(`${config_1.ORDER_BASE_URL}/api/v1/order`, "order");
        exports.axiosOrderInstance = this.axiosService.axios;
    }
    createOrderIntent(buyerId, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.post("/create-payment-intent", { buyerId, price });
            return response;
        });
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.post("/", data);
            return response;
        });
    }
    getOrderByOrderId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.get(`/${id}`);
            return response;
        });
    }
    getOrdersBySellerId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.get(`/seller/${id}`);
            return response;
        });
    }
    getOrdersByBuyerId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.get(`/buyer/${id}`);
            return response;
        });
    }
    approveOrder(orderId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.put(`/approve-order/${orderId}`, data);
            return response;
        });
    }
    cancelOrder(orderId, data, paymentIntentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.put(`/cancel/${orderId}`, { orderData: data, paymentIntentId });
            return response;
        });
    }
    updateDeliveryDate(type, orderId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.put(`/gig/${type}/${orderId}`, data);
            return response;
        });
    }
    requestDeliveryDateExtension(orderId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.put(`/extension/${orderId}`, data);
            return response;
        });
    }
    deliverOrder(orderId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.put(`/deliver-order/${orderId}`, data);
            return response;
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.get(`/notifications/${userId}`);
            return response;
        });
    }
    markNotificationAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosOrderInstance.put("/notification/mark-as-read", {
                notificationId
            });
            return response;
        });
    }
}
exports.orderService = new OrderService();
//# sourceMappingURL=order.api.service.js.map