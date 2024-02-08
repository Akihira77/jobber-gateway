import { gigService } from "@gateway/services/api/gig.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Get {
    public async gigById(req: Request, res: Response): Promise<void> {
        const response = await gigService.getGigById(req.params.gigId);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gig: response.data.gig
        });
    }

    public async gigsByCategory(req: Request, res: Response): Promise<void> {
        const response = await gigService.getGigsByCategory(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gigs: response.data.gigs
        });
    }

    public async sellerActiveGigs(req: Request, res: Response): Promise<void> {
        const response = await gigService.getSellerActiveGigs(
            req.params.sellerId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gigs: response.data.gigs
        });
    }

    public async sellerInactiveGigs(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await gigService.getSellerInactiveGigs(
            req.params.sellerId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gigs: response.data.gigs
        });
    }

    public async gigsMoreLikeThis(req: Request, res: Response): Promise<void> {
        const response = await gigService.getMoreGigsLikeThis(req.params.gigId);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gigs: response.data.gigs
        });
    }

    public async topRatedGigsByCategory(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await gigService.getTopRatedGigsByCategory(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gigs: response.data.gigs
        });
    }
}
