import { orderService } from "@gateway/services/api/order.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Create {
    public async orderIntent(req: Request, res: Response): Promise<void> {
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

    public async order(req: Request, res: Response): Promise<void> {
        const response = await orderService.createOrder(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            order: response.data.order
        });
    }
}
