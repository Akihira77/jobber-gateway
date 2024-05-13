import {
    BadRequestError,
    IAuthPayload,
    NotAuthorizedError
} from "@Akihira77/jobber-shared";
import { JWT_TOKEN } from "@gateway/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

class AuthMiddleware {
    public authOnly(req: Request, _res: Response, next: NextFunction): void {
        if (!req.session?.jwt) {
            throw new NotAuthorizedError(
                "Token is not available. Please login again",
                "GatewayService verifyUser() method error"
            );
        }

        try {
            const payload: IAuthPayload = jwt.verify(
                req.session?.jwt,
                `${JWT_TOKEN}`,
                {
                    algorithms: ["HS512"]
                }
            ) as IAuthPayload;

            req.currentUser = payload;
        } catch (error) {
            throw new NotAuthorizedError(
                "Token is not correct. Please login again",
                "GatewayService verifyUser() method invalid session error"
            );
        }

        next();
    }

    public verifyAuth(req: Request, _res: Response, next: NextFunction): void {
        if (!req.currentUser) {
            throw new BadRequestError(
                "Authentication is required to access this route",
                "GatewayService checkAuthentication() method error"
            );
        }

        next();
    }
}

export const authMiddleware = new AuthMiddleware();
