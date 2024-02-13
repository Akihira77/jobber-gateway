import { reviewService } from "@gateway/services/api/review.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Create {
    public async review(req: Request, res: Response): Promise<void> {
        const response = await reviewService.addReview(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            review: response.data.review
        });
    }
}