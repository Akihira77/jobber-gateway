import { UserHandler } from "@gateway/handler/user.handler"
import { BASE_PATH } from "@gateway/routes"
import { Context, Hono } from "hono"
import { StatusCodes } from "http-status-codes"
import { RedisClient } from "../redis/gateway.redis"
import typia from "typia"

export function buyerRoute(
    api: Hono<Record<string, never>, Record<string, never>, typeof BASE_PATH>,
    redis: RedisClient
): void {
    const userHndlr = new UserHandler()

    api.get("/buyer/email", async (c: Context) => {
        const { buyer, message } = await userHndlr.getCurrentBuyerByEmail()

        return c.json({ message, buyer }, StatusCodes.OK)
    })

    api.get("/buyer/username", async (c: Context) => {
        const { buyer, message } = await userHndlr.getCurrentBuyerByUsername()

        return c.json({ message, buyer }, StatusCodes.OK)
    })

    api.get("/buyer/:username", async (c: Context) => {
        try {
            const username = c.req.param("username")
            const cachedData = await redis.getDataFromCache(c.req.path)
            if (!cachedData) {
                const { buyer, message } =
                    await userHndlr.getBuyerByUsername(username)

                redis.setDataToCache(
                    `buyer-username:${username}`,
                    buyer,
                    30 * 60
                )
                return c.json({ message, buyer }, StatusCodes.OK)
            }

            const buyer = typia.json.isParse<any>(cachedData)
            return c.json({ message: "Buyer data", buyer }, StatusCodes.OK)
        } catch (error) {
            return c.json(
                {
                    message: "Got unexpected error",
                    buyer: null
                },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })
}
