import { sellerService } from "@gateway/services/api/seller.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Seed {
    public async seller(req: Request, res: Response): Promise<void> {
        const response = await sellerService.seed(req.params.count);

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }
}
