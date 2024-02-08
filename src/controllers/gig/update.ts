import { gigService } from "@gateway/services/api/gig.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Update {
    public async gig(req: Request, res: Response): Promise<void> {
        const response = await gigService.updateGig(req.params.gigId, req.body);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gig: response.data.gig
        });
    }

    public async gigActiveStatus(req: Request, res: Response): Promise<void> {
        const response = await gigService.updateGigActiveStatus(
            req.params.gigId,
            req.body.active
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gig: response.data.gig
        });
    }
}
