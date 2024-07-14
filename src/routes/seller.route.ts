import { UserHandler } from "@gateway/handler/user.handler"
import { BASE_PATH } from "@gateway/routes"
import { Context, Hono } from "hono"
import { StatusCodes } from "http-status-codes"
import { RedisClient } from "../redis/gateway.redis"
import typia from "typia"

export function sellerRoute(
    api: Hono<Record<string, never>, Record<string, never>, typeof BASE_PATH>,
    redis: RedisClient
): void {
    const userHndlr = new UserHandler()

    api.get("/seller/id/:sellerId", async (c: Context) => {
        try {
            const sellerId = c.req.param("sellerId")
            const cachedData = await redis.getDataFromCache(
                `seller-id:${sellerId}`
            )
            if (!cachedData) {
                const { message, seller } =
                    await userHndlr.getSellerById(sellerId)

                redis.setDataToCache(`seller-id:${sellerId}`, seller, 5 * 60)
                return c.json({ message, seller }, StatusCodes.OK)
            }

            const seller = typia.json.isParse<any>(cachedData)
            return c.json({ message: "Seller data", seller }, StatusCodes.OK)
        } catch (error) {
            return c.json(
                { message: "Got unexpected error", seller: null },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })
    api.get("/seller/username/:username", async (c: Context) => {
        try {
            const username = c.req.param("username")
            const cachedData = await redis.getDataFromCache(
                `seller-username:${username}`
            )
            if (!cachedData) {
                const { message, seller } =
                    await userHndlr.getSellerByUsername(username)

                redis.setDataToCache(
                    `seller-username:${username}`,
                    seller,
                    5 * 60
                )
                return c.json({ message, seller }, StatusCodes.OK)
            }

            const seller = typia.json.isParse<any>(cachedData)
            return c.json({ message: "Seller data", seller }, StatusCodes.OK)
        } catch (error) {
            return c.json(
                { message: "Got unexpected error", seller: null },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.get("/seller/random/:count", async (c: Context) => {
        try {
            const count = c.req.param("count")
            const cachedData = await redis.getDataFromCache(
                `random-seller-count:${count}`
            )
            if (!cachedData) {
                const { message, sellers } =
                    await userHndlr.getRandomSellers(count)

                redis.setDataToCache(
                    `random-seller-count:${count}`,
                    sellers,
                    60
                )
                return c.json({ message, sellers }, StatusCodes.OK)
            }

            const sellers = typia.json.isParse<any>(cachedData)
            return c.json(
                { message: "Random sellers", sellers },
                StatusCodes.OK
            )
        } catch (error) {
            return c.json(
                { message: "Got unexpected error", sellers: [] },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.post("/seller/create", async (c: Context) => {
        const jsonBody = await c.req.json()
        const { message, seller } = await userHndlr.addSeller(jsonBody)

        redis.setDataToCache(
            `seller-username:${seller.username}`,
            seller,
            5 * 60
        )
        return c.json({ message, seller }, StatusCodes.CREATED)
    })

    api.put("/seller/update/:sellerId", async (c: Context) => {
        const sellerId = c.req.param("sellerId")
        const jsonBody = await c.req.json()
        const { message, seller } = await userHndlr.updateSellerInfo(
            sellerId,
            jsonBody
        )

        redis.setDataToCache(
            `seller-username:${seller.username}`,
            seller,
            5 * 60
        )
        return c.json({ message, seller }, StatusCodes.OK)
    })

    api.put("/seller/seed/:count", async (c: Context) => {
        const count = c.req.param("count")
        const { message } = await userHndlr.populateSeller(count)
        return c.json({ message }, StatusCodes.OK)
    })
}
