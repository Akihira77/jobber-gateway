import { sellerService } from "@gateway/services/api/seller.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Get {
    public async byId(req: Request, res: Response): Promise<void> {
        const response = await sellerService.getSellerById(req.params.sellerId);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            seller: response.data.seller
        });
    }

    public async byUsername(req: Request, res: Response): Promise<void> {
        const response = await sellerService.getSellerByUsername(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            seller: response.data.seller
        });
    }

    public async randomSellers(req: Request, res: Response): Promise<void> {
        const response = await sellerService.getRandomSellers(req.params.count);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            sellers: response.data.sellers
        });
    }
}
