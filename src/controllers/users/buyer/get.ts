import { buyerService } from "@gateway/services/api/buyer.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Get {
    public async byEmail(_req: Request, res: Response): Promise<void> {
        const response = await buyerService.getBuyerByEmail();

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            buyer: response.data.buyer
        });
    }

    public async byCurrentUsername(
        _req: Request,
        res: Response
    ): Promise<void> {
        const response = await buyerService.getCurrentBuyerByUsername();

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            buyer: response.data.buyer
        });
    }

    public async byUsername(req: Request, res: Response): Promise<void> {
        const response = await buyerService.getBuyerByUsername(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            buyer: response.data.buyer
        });
    }
}
