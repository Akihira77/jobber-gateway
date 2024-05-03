import { sellerService } from "@gateway/services/api/seller.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Create {
    public async newSeller(req: Request, res: Response): Promise<void> {
        const response = await sellerService.createSeller(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            seller: response.data.seller
        });
    }
}
