import { SECRET_KEY_ONE, SECRET_KEY_TWO } from "@gateway/config"
import { AuthHandler } from "@gateway/handler/auth.handler"
import { RedisClient } from "@gateway/redis/gateway.redis"
import { BASE_PATH } from "@gateway/routes"
import { Hono, Context } from "hono"
import { setSignedCookie } from "hono/cookie"
import { StatusCodes } from "http-status-codes"

export function authRoute(
    api: Hono<Record<string, never>, Record<string, never>, typeof BASE_PATH>,
    redis: RedisClient
): void {
    const authHndlr = new AuthHandler(redis)

    api.get("/auth/current-user", async (c: Context) => {
        const { message, user } =
            await authHndlr.getCurrentUser.bind(authHndlr)()

        return c.json({ message, user }, StatusCodes.OK)
    })

    api.get("/auth/logged-in-user", async (c: Context) => {
        await authHndlr.getLoggedInUsers.bind(authHndlr)()

        return c.text("Users online", StatusCodes.OK)
    })

    api.get("/auth/refresh-token/:username", async (c: Context) => {
        const username = c.req.param("username")
        const { token, message, user } =
            await authHndlr.getRefreshToken.bind(authHndlr)(username)

        const time = 7 * 24 * 60 * 60
        await setSignedCookie(
            c,
            "session",
            token,
            `${SECRET_KEY_ONE}${SECRET_KEY_TWO}`,
            {
                httpOnly: true,
                maxAge: time, // 7 days,
                expires: new Date(new Date().valueOf() + time),
                // 7 * 24 * 60 * 60 * 1000
                secure: true,
                sameSite: "none",
                path: "/"
            }
        )

        return c.json({ message, user }, StatusCodes.OK)
    })

    api.put("/auth/change-password", async (c: Context) => {
        const jsonBody = await c.req.json()
        const message = await authHndlr.changePassword(jsonBody)

        return c.json({ message }, StatusCodes.OK)
    })

    api.post("/auth/resend-verification-email", async (c: Context) => {
        const jsonBody = await c.req.json()
        const { message, user } =
            await authHndlr.resendVerificationEmail.bind(authHndlr)(jsonBody)

        return c.json({ message, user }, StatusCodes.OK)
    })

    api.delete("/auth/logged-in-user/:username", async (c: Context) => {
        const username = c.req.param("username")
        await authHndlr.removeLoggedInUsers.bind(authHndlr)(username)

        return c.text("User is offline", StatusCodes.OK)
    })
}
