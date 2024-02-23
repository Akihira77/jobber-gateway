import { authService } from "@gateway/services/api/auth.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Refresh {
    public async token(req: Request, res: Response): Promise<void> {
        const response = await authService.getRefreshToken(req.params.username);

        // look at signIn controller returned inside 3-auth-service
        const { token, message, user } = response.data;

        req.session = {
            jwt: token
        };

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }
}
