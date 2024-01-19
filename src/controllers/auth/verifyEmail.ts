import { authService } from "@gateway/services/api/auth.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class VerifyEmail {
    public async update(
        req: Request<never, never, { token: string }, never>,
        res: Response
    ): Promise<void> {
        const response = await authService.verifyEmail(req.body.token);

        // look at signUp controller returned inside 3-auth-service
        const { message, user } = response.data;

        res.status(StatusCodes.OK).json({
            message,
            user
        });
    }
}
