import { gigService } from "@gateway/services/api/gig.api.service";
import { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class GigSeed {
    public async generate(req: Request, res: Response): Promise<void> {
        const response: AxiosResponse = await gigService.seed(req.params.count);

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }
}
