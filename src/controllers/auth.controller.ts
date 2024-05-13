import { GatewayCache } from "@gateway/redis/gateway.cache";
import { socketIO } from "@gateway/server";
import { authService } from "@gateway/services/api/auth.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AuthController {
    private gatewayCache: GatewayCache;

    constructor() {
        this.gatewayCache = new GatewayCache();
    }

    public async getCurrentUser(_req: Request, res: Response): Promise<void> {
        const response = await authService.getCurrentUser();
        const { message, user } = response.data;

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }

    public async resendVerificationEmail(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await authService.resendEmail(req.body);
        const { message, user } = response.data;

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }

    public async getLoggedInUsers(_req: Request, res: Response): Promise<void> {
        const response =
            await this.gatewayCache.getLoggedInUsersFromCache("loggedInUsers");
        socketIO.emit("online", response);

        res.status(StatusCodes.OK).json({
            message: "User is online"
        });
    }

    public async removeLoggedInUsers(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await this.gatewayCache.removeLoggedInUserFromCache(
            "loggedInUsers",
            req.params.username
        );
        socketIO.emit("online", response);

        res.status(StatusCodes.OK).json({
            message: "User is offline"
        });
    }

    public async forgotPassword(req: Request, res: Response) {
        const response = await authService.forgotPassword(req.body.email);

        res.status(StatusCodes.OK).json({ message: response.data.message });
    }

    public async resetPassword(req: Request, res: Response) {
        const { password, confirmPassword } = req.body;
        const response = await authService.resetPassword(
            req.params.token,
            password,
            confirmPassword
        );

        res.status(StatusCodes.OK).json({ message: response.data.message });
    }

    public async changePassword(req: Request, res: Response) {
        const { newPassword, currentPassword } = req.body;
        const response = await authService.changePassword(
            currentPassword,
            newPassword
        );

        res.status(StatusCodes.OK).json({ message: response.data.message });
    }

    public async getRefreshToken(req: Request, res: Response): Promise<void> {
        const response = await authService.getRefreshToken(req.params.username);
        const { token, message, user } = response.data;
        req.session = {
            jwt: token
        };

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }

    public async getGigById(req: Request, res: Response): Promise<void> {
        const response = await authService.getGigById(req.params.id);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            gig: response.data.gig
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
        const response = await authService.getGigs(query, from, size, type);

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            total: response.data.total,
            gigs: response.data.gigs
        });
    }

    public async signIn(req: Request, res: Response): Promise<void> {
        const response = await authService.signIn(req.body);
        const { token, message, user } = response.data;
        req.session = {
            jwt: token
        };

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }

    public async signOut(req: Request, res: Response): Promise<void> {
        req.session = null;
        res.status(StatusCodes.OK).json({
            message: "Logout successful",
            user: {}
        });
    }

    public async signUp(req: Request, res: Response): Promise<void> {
        const response = await authService.signUp(req.body);
        const { token, message, user } = response.data;
        req.session = {
            jwt: token
        };

        res.status(StatusCodes.CREATED).json({
            message,
            user
        });
    }

    public async verifyEmail(req: Request, res: Response): Promise<void> {
        const response = await authService.verifyEmail(req.body.token);
        const { message, user } = response.data;

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }

    public async populateAuth(req: Request, res: Response): Promise<void> {
        const response = await authService.seed(req.params.count);

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }
}
