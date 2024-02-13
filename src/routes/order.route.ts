import { Create } from "@gateway/controllers/order/create";
import { Update } from "@gateway/controllers/order/update";
import { Get } from "@gateway/controllers/order/get";
import express, { Router } from "express";
import { authMiddleware } from "@gateway/services/auth-middleware";

class OrderRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get(
            "/order/:orderId",
            authMiddleware.checkAuthentication,
            Get.prototype.byOrderId
        );
        this.router.get(
            "/order/seller/:orderId",
            authMiddleware.checkAuthentication,
            Get.prototype.sellerOrders
        );
        this.router.get(
            "/order/buyerId/:orderId",
            authMiddleware.checkAuthentication,
            Get.prototype.buyerOrders
        );
        this.router.get(
            "/order/notification/:userId",
            authMiddleware.checkAuthentication,
            Get.prototype.notifications
        );

        this.router.post(
            "/order/create-payment-intent",
            authMiddleware.checkAuthentication,
            Create.prototype.orderIntent
        );
        this.router.post(
            "/order",
            authMiddleware.checkAuthentication,
            Create.prototype.order
        );

        this.router.put(
            "/order/approve-order/:orderId",
            authMiddleware.checkAuthentication,
            Update.prototype.approveOrder
        );
        this.router.put(
            "/order/cancel/:orderId",
            authMiddleware.checkAuthentication,
            Update.prototype.cancelOrder
        );
        this.router.put(
            "/order/gig/:type/:orderId",
            authMiddleware.checkAuthentication,
            Update.prototype.updateDeliveryDate
        );
        this.router.put(
            "/order/extension/:orderId",
            authMiddleware.checkAuthentication,
            Update.prototype.requestDeliveryDateExtension
        );
        this.router.put(
            "/order/deliver-order/:orderId",
            authMiddleware.checkAuthentication,
            Update.prototype.deliverOrder
        );
        this.router.put(
            "/order/notification/:notificationId",
            authMiddleware.checkAuthentication,
            Update.prototype.markNotificationAsRead
        );

        return this.router;
    }
}

export const orderRoutes = new OrderRoutes();
