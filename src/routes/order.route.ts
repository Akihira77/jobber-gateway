import express, { Router } from "express";
import { authMiddleware } from "@gateway/services/auth-middleware";
import { OrderController } from "@gateway/controllers/order.controller";

class OrderRoutes {
    private router: Router;
    private controller: OrderController;

    constructor() {
        this.router = express.Router();
        this.controller = new OrderController();
    }

    public routes(): Router {
        this.router.get(
            "/order/:orderId",
            authMiddleware.verifyAuth,
            this.controller.getOrderByOrderId
        );
        this.router.get(
            "/order/seller/:orderId",
            authMiddleware.verifyAuth,
            this.controller.getSellerOrders
        );
        this.router.get(
            "/order/buyer/:orderId",
            authMiddleware.verifyAuth,
            this.controller.gerBuyerOrders
        );
        this.router.get(
            "/order/notification/:userTo",
            authMiddleware.verifyAuth,
            this.controller.getNotifications
        );

        this.router.post(
            "/order/create-payment-intent",
            authMiddleware.verifyAuth,
            this.controller.createOrderIntent
        );
        this.router.post(
            "/order",
            authMiddleware.verifyAuth,
            this.controller.buyerCreateOrder
        );

        this.router.put(
            "/order/approve-order/:orderId",
            authMiddleware.verifyAuth,
            this.controller.buyerApproveOrder
        );
        this.router.put(
            "/order/cancel/:orderId",
            authMiddleware.verifyAuth,
            this.controller.sellerCancelOrder
        );
        this.router.put(
            "/order/gig/:type/:orderId",
            authMiddleware.verifyAuth,
            this.controller.updateDeliveryDate
        );
        this.router.put(
            "/order/extension/:orderId",
            authMiddleware.verifyAuth,
            this.controller.sellerRequestDeliveryDateExtension
        );
        this.router.put(
            "/order/deliver-order/:orderId",
            authMiddleware.verifyAuth,
            this.controller.sellerDeliverOrder
        );
        this.router.put(
            "/order/notification/:notificationId",
            authMiddleware.verifyAuth,
            this.controller.markNotificationAsRead
        );

        return this.router;
    }
}

export const orderRoutes = new OrderRoutes();
