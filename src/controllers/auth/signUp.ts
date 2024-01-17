import { IAuth } from "@Akihira77/jobber-shared";
import { authService } from "@gateway/services/api/auth.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class SignUp {
    public async create(
        req: Request<never, never, IAuth, never>,
        res: Response
    ): Promise<void> {
        const response = await authService.signUp(req.body);

        // look at signUp controller returned inside 3-auth-service
        const { token, message, user } = response.data;

        req.session = {
            jwt: token
        };

        res.status(StatusCodes.CREATED).json({
            message,
            user
        });
    }
}
