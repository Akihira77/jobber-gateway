import { orderService } from "@gateway/services/api/order.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class OrderController {
    public async getOrderByOrderId(req: Request, res: Response): Promise<void> {
        const response = await orderService.getOrderByOrderId(
            req.params.orderId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            order: response.data.order
        });
    }

    public async getSellerOrders(req: Request, res: Response): Promise<void> {
        const response = await orderService.getOrdersBySellerId(
            req.params.orderId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            orders: response.data.orders
        });
    }

    public async gerBuyerOrders(req: Request, res: Response): Promise<void> {
        const response = await orderService.getOrdersByBuyerId(
            req.params.orderId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            orders: response.data.orders
        });
    }

    public async getNotifications(req: Request, res: Response): Promise<void> {
        const response = await orderService.getNotifications(req.params.userTo);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            notifications: response.data.notifications
        });
    }
    public async createOrderIntent(req: Request, res: Response): Promise<void> {
        const response = await orderService.createOrderIntent(
            req.body.buyerId,
            req.body.price
        );

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            clientSecret: response.data.clientSecret,
            paymentIntentId: response.data.paymentIntentId
        });
    }

    public async buyerCreateOrder(req: Request, res: Response): Promise<void> {
        const response = await orderService.createOrder(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            order: response.data.order
        });
    }

    public async sellerCancelOrder(req: Request, res: Response): Promise<void> {
        const response = await orderService.cancelOrder(
            req.params.orderId,
            req.body.orderData,
            req.body.paymentIntentId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }

    public async sellerRequestDeliveryDateExtension(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await orderService.requestDeliveryDateExtension(
            req.params.orderId,
            req.body
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            order: response.data.order
        });
    }

    public async updateDeliveryDate(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await orderService.updateDeliveryDate(
            req.params.type,
            req.params.orderId,
            req.body
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            order: response.data.order
        });
    }

    public async buyerApproveOrder(req: Request, res: Response): Promise<void> {
        const response = await orderService.approveOrder(
            req.params.orderId,
            req.body
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            order: response.data.order
        });
    }

    public async sellerDeliverOrder(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await orderService.deliverOrder(
            req.params.orderId,
            req.body
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            order: response.data.order
        });
    }

    public async markNotificationAsRead(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await orderService.markNotificationAsRead(
            req.body.notificationId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            notification: response.data.notification
        });
    }
}
