import { gigService } from "@gateway/services/api/gig.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Create {
    public async gig(req: Request, res: Response): Promise<void> {
        const response = await gigService.createGig(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            gig: response.data.gig
        });
    }
}
