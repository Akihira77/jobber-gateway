import { buyerService } from "@gateway/services/api/buyer.api.service";
import { sellerService } from "@gateway/services/api/seller.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class UserController {
    public async getBuyerByEmail(_req: Request, res: Response): Promise<void> {
        const response = await buyerService.getBuyerByEmail();

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            buyer: response.data.buyer
        });
    }

    public async getCurrentBuyer(_req: Request, res: Response): Promise<void> {
        const response = await buyerService.getCurrentBuyerByUsername();

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            buyer: response.data.buyer
        });
    }

    public async getBuyerByUsername(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await buyerService.getBuyerByUsername(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            buyer: response.data.buyer
        });
    }

    public async getSellerById(req: Request, res: Response): Promise<void> {
        const response = await sellerService.getSellerById(req.params.sellerId);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            seller: response.data.seller
        });
    }

    public async getSellerByUsername(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await sellerService.getSellerByUsername(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            seller: response.data.seller
        });
    }

    public async getRandomSellers(req: Request, res: Response): Promise<void> {
        const response = await sellerService.getRandomSellers(req.params.count);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            sellers: response.data.sellers
        });
    }

    public async addSeller(req: Request, res: Response): Promise<void> {
        const response = await sellerService.createSeller(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            seller: response.data.seller
        });
    }

    public async updateSellerInfo(req: Request, res: Response): Promise<void> {
        const response = await sellerService.updateSeller(
            req.params.sellerId,
            req.body
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            seller: response.data.seller
        });
    }

    public async populateSeller(req: Request, res: Response): Promise<void> {
        const response = await sellerService.seed(req.params.count);

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }
}
