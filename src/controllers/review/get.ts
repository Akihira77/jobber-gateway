import { reviewService } from "@gateway/services/api/review.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Get {
    public async reviewsByGigId(req: Request, res: Response): Promise<void> {
        const response = await reviewService.getReviewsByGigId(
            req.params.gigId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            reviews: response.data.reviews
        });
    }

    public async reviewsBySellerId(req: Request, res: Response): Promise<void> {
        const response = await reviewService.getReviewsBySellerId(
            req.params.sellerId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            reviews: response.data.reviews
        });
    }
}