import {
    BadRequestError,
    IAuthPayload,
    NotAuthorizedError
} from "@Akihira77/jobber-shared"
import { JWT_TOKEN, SECRET_KEY_ONE, SECRET_KEY_TWO } from "@gateway/config"
import { Context, Next } from "hono"
import { getSignedCookie } from "hono/cookie"
import { createVerifier } from "fast-jwt"

export class AuthMiddleware {
    constructor() {}
    public async authOnly(c: Context, next: Next): Promise<void> {
        try {
            let token = await getSignedCookie(
                c,
                `${SECRET_KEY_ONE}${SECRET_KEY_TWO}`,
                "session"
            )
            if (!token) {
                const authHeader = c.req.header("Authorization")
                if (authHeader && authHeader.startsWith("Bearer ")) {
                    token = authHeader.split("Bearer ")[1]
                } else {
                    throw new NotAuthorizedError(
                        "Token is not available. Please login again",
                        "GatewayService authOnly() method error"
                    )
                }
            }

            const verifyAsync = async <T>(token: string): Promise<T> => {
                try {
                    const verifier = createVerifier({
                        key: async () => `${JWT_TOKEN}`,
                        algorithms: ["HS512"],
                        cache: true,
                        cacheTTL: 30 * 60 * 1000 // 30 minutes
                    })

                    return (await verifier(token)) as T
                } catch (error) {
                    console.log(error)
                    return {} as T
                }
            }

            const payload = await verifyAsync<IAuthPayload>(token)

            c.set("currentUser", payload)
            await next()
        } catch (error) {
            console.log(error)
            throw new NotAuthorizedError(
                "Token is not correct. Please login again",
                "GatewayService authOnly() method invalid session error"
            )
        }
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
