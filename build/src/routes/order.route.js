"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../services/auth-middleware");
const order_controller_1 = require("../controllers/order.controller");
class OrderRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new order_controller_1.OrderController();
    }
    routes() {
        this.router.get("/order/:orderId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getOrderByOrderId);
        this.router.get("/order/seller/:orderId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getSellerOrders);
        this.router.get("/order/buyer/:orderId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.gerBuyerOrders);
        this.router.get("/order/notification/:userTo", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getNotifications);
        this.router.post("/order/create-payment-intent", auth_middleware_1.authMiddleware.verifyAuth, this.controller.createOrderIntent);
        this.router.post("/order", auth_middleware_1.authMiddleware.verifyAuth, this.controller.buyerCreateOrder);
        this.router.put("/order/approve-order/:orderId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.buyerApproveOrder);
        this.router.put("/order/cancel/:orderId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.sellerCancelOrder);
        this.router.put("/order/gig/:type/:orderId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.updateDeliveryDate);
        this.router.put("/order/extension/:orderId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.sellerRequestDeliveryDateExtension);
        this.router.put("/order/deliver-order/:orderId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.sellerDeliverOrder);
        this.router.put("/order/notification/:notificationId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.markNotificationAsRead);
        return this.router;
    }
}
exports.orderRoutes = new OrderRoutes();
//# sourceMappingURL=order.route.js.map