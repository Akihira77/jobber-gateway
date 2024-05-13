import { gigService } from "@gateway/services/api/gig.api.service";
import { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class GigController {
    public async createGig(req: Request, res: Response): Promise<void> {
        const response = await gigService.createGig(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            gig: response.data.gig
        });
    }

    public async deleteGig(req: Request, res: Response): Promise<void> {
        const response = await gigService.deleteGig(
            req.params.gigId,
            req.params.sellerId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }

    public async getGigById(req: Request, res: Response): Promise<void> {
        const response = await gigService.getGigById(req.params.gigId);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gig: response.data.gig
        });
    }

    public async getGigsByCategory(req: Request, res: Response): Promise<void> {
        const response = await gigService.getGigsByCategory(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gigs: response.data.gigs
        });
    }

    public async getSellerActiveGigs(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await gigService.getSellerActiveGigs(
            req.params.sellerId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gigs: response.data.gigs
        });
    }

    public async getSellerInactiveGigs(
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

    public async getGigsMoreLikeThis(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await gigService.getMoreGigsLikeThis(req.params.gigId);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gigs: response.data.gigs
        });
    }

    public async getTopRatedGigsByCategory(
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

    public async getGigsQuerySearch(
        req: Request,
        res: Response
    ): Promise<void> {
        const { from, size, type } = req.params;
        let query = "";
        const objList = Object.entries(req.query);
        const lastItemIndex = objList.length - 1;
        objList.forEach(([key, value], index) => {
            query += `${key}=${value}${index !== lastItemIndex ? "&" : ""}`;
        });

        const response: AxiosResponse = await gigService.searchGigs(
            `${query}`,
            from,
            size,
            type
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            total: response.data.total,
            gigs: response.data.gigs
        });
    }

    public async updateGig(req: Request, res: Response): Promise<void> {
        const response = await gigService.updateGig(req.params.gigId, req.body);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gig: response.data.gig
        });
    }

    public async updateGigActiveStatus(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await gigService.updateGigActiveStatus(
            req.params.gigId,
            req.body.active
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gig: response.data.gig
        });
    }

    public async populateGigs(req: Request, res: Response): Promise<void> {
        const response: AxiosResponse = await gigService.seed(req.params.count);

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }
}
