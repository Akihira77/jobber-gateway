import { gigService } from "@gateway/services/api/gig.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Delete {
    public async gig(req: Request, res: Response): Promise<void> {
        const response = await gigService.deleteGig(
            req.params.gigId,
            req.params.sellerId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }
}
