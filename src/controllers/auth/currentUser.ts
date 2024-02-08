import { GatewayCache } from "@gateway/redis/gateway.cache";
import { socketIO } from "@gateway/server";
import { authService } from "@gateway/services/api/auth.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const gatewayCache = new GatewayCache();

export class CurrentUser {
    public async get(
        _req: Request<never, never, never, never>,
        res: Response
    ): Promise<void> {
        const response = await authService.getCurrentUser();

        // look at signIn controller returned inside 3-auth-service
        const { message, user } = response.data;

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }

    public async resendVerificationEmail(
        req: Request<never, never, { userId: number; email: string }, never>,
        res: Response
    ): Promise<void> {
        const response = await authService.resendEmail(req.body);

        // look at signIn controller returned inside 3-auth-service
        const { message, user } = response.data;

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }

    public async getLoggedInUsers(_req: Request, res: Response): Promise<void> {
        const response =
            await gatewayCache.getLoggedInUsersFromCache("loggedInUsers");
        socketIO.emit("online", response);

        res.status(StatusCodes.OK).json({
            message: "User is online"
        });
    }

    public async removeLoggedInUsers(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await gatewayCache.removeLoggedInUserFromCache(
            "loggedInUsers",
            req.params.username
        );
        socketIO.emit("online", response);

        res.status(StatusCodes.OK).json({
            message: "User is offline"
        });
    }
}
