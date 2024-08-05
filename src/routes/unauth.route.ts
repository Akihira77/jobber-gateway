import { NotAuthorizedError } from "@Akihira77/jobber-shared"
import { SECRET_KEY_ONE, SECRET_KEY_TWO } from "@gateway/config"
import { AuthHandler } from "@gateway/handler/auth.handler"
import { RedisClient } from "@gateway/redis/gateway.redis"
import { BASE_PATH } from "@gateway/routes"
import { Hono, Context } from "hono"
import { setSignedCookie, deleteCookie, getSignedCookie } from "hono/cookie"
import { StatusCodes } from "http-status-codes"
import typia from "typia"

export function unauthRoute(
    api: Hono<Record<string, never>, Record<string, never>, typeof BASE_PATH>,
    redis: RedisClient
): void {
    const authHndlr = new AuthHandler(redis)

    api.get("/auth/search/gig/:from/:size/:type", async (c: Context) => {
        try {
            const cachedData = await redis.getDataFromCache(c.req.path)
            // const cachedData = null
            if (cachedData) {
                const data = typia.json.isParse<any>(cachedData) as any
                return c.json(
                    {
                        message: "Gigs data",
                        total: data.total,
                        gigs: data.gigs
                    },
                    StatusCodes.OK
                )
            }

            const { from, size, type } = c.req.param()
            const queries = c.req.query()

            const { message, total, gigs } = await authHndlr.getGigsQuerySearch(
                { from, size: parseInt(size), type },
                queries
            )

            redis.setDataToCache(
                c.req.path,
                { total: total, gigs: gigs },
                true,
                10 * 60
            )
            return c.json({ message, total, gigs }, StatusCodes.OK)
        } catch (error) {
            console.log(error)
            return c.json(
                {
                    message: "Got unexpected error",
                    total: 0,
                    gigs: []
                },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.get("/auth/search/gig/:id", async (c: Context) => {
        try {
            const cachedData = await redis.getDataFromCache(c.req.path)
            if (!cachedData) {
                const id = c.req.param("id")
                const { gig, message } = await authHndlr.getGigById(id)

                redis.setDataToCache(c.req.path, gig, true, 60 * 60)
                return c.json({ message, gig }, StatusCodes.OK)
            }

            const gig = typia.json.isParse<any>(cachedData)
            return c.json({ message: "Gig data", gig }, StatusCodes.OK)
        } catch (error) {
            return c.json(
                {
                    message: "Got unexpected error",
                    gig: null
                },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.post("/auth/signup", async (c: Context) => {
        const jsonBody = await c.req.json()
        const { token, message, user } = await authHndlr.signUp(jsonBody)

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

        return c.json({ message, user }, StatusCodes.CREATED)
    })

    api.post("/auth/signin", async (c: Context) => {
        const jsonBody = await c.req.json()
        const { token, message, user } = await authHndlr.signIn(jsonBody)

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

    api.put("/auth/signout", (c: Context) => {
        deleteCookie(c, "session")

        return c.text("Successfully signout")
    })

    api.put("/auth/verify-email", async (c: Context) => {
        const token = await getSignedCookie(
            c,
            `${SECRET_KEY_ONE}${SECRET_KEY_TWO}`,
            "session"
        )

        if (!token) {
            throw new NotAuthorizedError("Unauthenticated user", "API Gateway")
        }

        const { message, user } = await authHndlr.verifyEmail(token)
        return c.json({ message, user }, StatusCodes.OK)
    })

    api.put("/auth/forgot-password", async (c: Context) => {
        const { email } = await c.req.json()
        const message = await authHndlr.forgotPassword(email)
        return c.json({ message }, StatusCodes.OK)
    })

    api.put("/auth/reset-password/:token", async (c: Context) => {
        const token = c.req.param("token")
        const jsonBody = await c.req.json()
        const message = await authHndlr.resetPassword(token, jsonBody)

        return c.json({ message }, StatusCodes.OK)
    })

    api.put("/auth/seed/:count", async (c: Context) => {
        const count = c.req.param("count")
        await authHndlr.populateAuth(count)

        return c.text("Success populate users account", StatusCodes.CREATED)
    })
}
