import { orderService } from "@gateway/services/api/order.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Update {
    public async cancelOrder(req: Request, res: Response): Promise<void> {
        const response = await orderService.cancelOrder(
            req.params.orderId,
            req.body.orderData,
            req.body.paymentIntentId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }

    public async requestDeliveryDateExtension(
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

    public async approveOrder(req: Request, res: Response): Promise<void> {
        const response = await orderService.approveOrder(
            req.params.orderId,
            req.body
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            order: response.data.order
        });
    }

    public async deliverOrder(req: Request, res: Response): Promise<void> {
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
