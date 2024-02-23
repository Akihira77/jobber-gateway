import { authService } from "@gateway/services/api/auth.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Password {
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
}
