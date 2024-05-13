import { reviewService } from "@gateway/services/api/review.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class ReviewController {
    public async addReview(req: Request, res: Response): Promise<void> {
        const response = await reviewService.addReview(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            review: response.data.review
        });
    }

    public async getReviewsByGigId(req: Request, res: Response): Promise<void> {
        const response = await reviewService.getReviewsByGigId(
            req.params.gigId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            reviews: response.data.reviews
        });
    }

    public async getReviewsBySellerId(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await reviewService.getReviewsBySellerId(
            req.params.sellerId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            reviews: response.data.reviews
        });
    }
}
