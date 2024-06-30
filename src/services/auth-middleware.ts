import {
    BadRequestError,
    IAuthPayload,
    NotAuthorizedError
} from "@Akihira77/jobber-shared"
import { JWT_TOKEN, SECRET_KEY_ONE, SECRET_KEY_TWO } from "@gateway/config"
import { Context, Next } from "hono"
import { getSignedCookie } from "hono/cookie"
import jwt from "jsonwebtoken"

class AuthMiddleware {
    public async authOnly(c: Context, next: Next): Promise<void> {
        const token = await getSignedCookie(
            c,
            `${SECRET_KEY_ONE}${SECRET_KEY_TWO}`,
            "session"
        )
        if (!token) {
            throw new NotAuthorizedError(
                "Token is not available. Please login again",
                "GatewayService authOnly() method error"
            )
        }

        try {
            const payload: IAuthPayload = jwt.verify(token, `${JWT_TOKEN}`, {
                algorithms: ["HS512"]
            }) as IAuthPayload

            c.set("currentUser", payload)
        } catch (error) {
            throw new NotAuthorizedError(
                "Token is not correct. Please login again",
                "GatewayService authOnly() method invalid session error"
            )
        }

        await next()
    }

    public async verifyAuth(c: Context, next: Next): Promise<void> {
        if (!c.get("currentUser")) {
            throw new BadRequestError(
                "Authentication is required to access this route",
                "GatewayService verifyAuth() method error"
            )
        }

        await next()
    }
}

export const authMiddleware = new AuthMiddleware()
