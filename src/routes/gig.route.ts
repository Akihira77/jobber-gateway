import { GigHandler } from "@gateway/handler/gig.handler"
import { BASE_PATH } from "@gateway/routes"
import { Context, Hono } from "hono"
import { StatusCodes } from "http-status-codes"
import { RedisClient } from "../redis/gateway.redis"
import typia from "typia"

export function gigRoute(
    api: Hono<Record<string, never>, Record<string, never>, typeof BASE_PATH>,
    redis: RedisClient
) {
    const gigHndlr = new GigHandler()

    api.get("/gig/:gigId", async (c: Context) => {
        try {
            const gigId = c.req.param("gigId")
            const cachedData = await redis.getDataFromCache(`gig:${gigId}`)
            if (!cachedData) {
                const { message, gig } = await gigHndlr.getGigById(gigId)

                redis.setDataToCache(`gig:${gigId}`, { gig: gig }, 60 * 60)
                return c.json({ message, gig }, StatusCodes.OK)
            }

            const { gig } = typia.json.isParse<any>(cachedData)
            return c.json({ message: "Gig data", gig }, StatusCodes.OK)
        } catch (error) {
            return c.json(
                { message: "Got unexpected error", gig: null },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.get("/gig/seller/:sellerId", async (c: Context) => {
        try {
            const sellerId = c.req.param("sellerId")
            const cachedData = await redis.getDataFromCache(
                `seller-gigs:${sellerId}`
            )
            if (!cachedData) {
                const { message, gigs } =
                    await gigHndlr.getSellerActiveGigs(sellerId)

                redis.setDataToCache(`seller-gigs:${sellerId}`, gigs, 60 * 60)
                return c.json({ message, gigs }, StatusCodes.OK)
            }

            const gigs = typia.json.isParse<any>(cachedData)

            return c.json(
                { message: "Seller active gigs", gigs },
                StatusCodes.OK
            )
        } catch (error) {
            return c.json(
                { message: "Got unexpected error", gigs: [] },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.get("/gig/seller/inactive/:sellerId", async (c: Context) => {
        try {
            const sellerId = c.req.param("sellerId")
            const cachedData = await redis.getDataFromCache(
                `seller-inactive-gigs:${sellerId}`
            )
            if (!cachedData) {
                const { message, gigs } =
                    await gigHndlr.getSellerInactiveGigs(sellerId)

                redis.setDataToCache(
                    `seller-inactive-gigs:${sellerId}`,
                    gigs,
                    60 * 60
                )
                return c.json({ message, gigs }, StatusCodes.OK)
            }

            const gigs = typia.json.isParse<any>(cachedData)
            return c.json(
                { message: "Seller inactive gigs", gigs },
                StatusCodes.OK
            )
        } catch (error) {
            return c.json(
                { message: "Got unexpected error", gigs: [] },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.get("/gig/search/:from/:size/:type", async (c: Context) => {
        try {
            const cachedData = await redis.getDataFromCache(c.req.path)
            if (!cachedData) {
                const { from, size, type } = c.req.param()
                const queries = c.req.query()
                const { message, total, gigs } =
                    await gigHndlr.getGigsQuerySearch(
                        { from, size: parseInt(size), type },
                        queries
                    )

                redis.setDataToCache(
                    c.req.path,
                    { total: total, gigs: gigs },
                    10 * 60
                )
                return c.json({ message, total, gigs }, StatusCodes.OK)
            }

            const { total, gigs } = typia.json.isParse<any>(cachedData)
            return c.json({ message: "Gigs data", total, gigs }, StatusCodes.OK)
        } catch (error) {
            return c.json(
                { message: "Got unexpected error", total: 0, gigs: [] },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.get("/gig/category/:username", async (c: Context) => {
        const username = c.req.param("username")
        const { message, gigs } = await gigHndlr.getGigsByCategory(username)

        return c.json({ message, gigs }, StatusCodes.OK)
    })

    api.get("/gig/top/:username", async (c: Context) => {
        const username = c.req.param("username")
        const { message, gigs } =
            await gigHndlr.getTopRatedGigsByCategory(username)

        return c.json({ message, gigs }, StatusCodes.OK)
    })

    api.get("/gig/similar/:gigId", async (c: Context) => {
        try {
            const cachedData = await redis.getDataFromCache(c.req.path)
            if (!cachedData) {
                const gigId = c.req.param("gigId")
                const { message, gigs } =
                    await gigHndlr.getGigsMoreLikeThis(gigId)

                redis.setDataToCache(c.req.path, gigs, 5 * 60)
                return c.json({ message, gigs }, StatusCodes.OK)
            }

            const gigs = typia.json.isParse<any>(cachedData)
            return c.json({ message: "Similar gigs", gigs }, StatusCodes.OK)
        } catch (error) {
            console.log(error)
            return c.json(
                { message: "Got unexpected error", gigs: [] },
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    })

    api.post("/gig/create", async (c: Context) => {
        const jsonBody = await c.req.json()
        const { message, gig } = await gigHndlr.createGig(jsonBody)

        redis.setDataToCache(`gig:${gig._id}`, gig, 60 * 60)
        return c.json({ message, gig }, StatusCodes.CREATED)
    })

    api.put("/gig/:gigId", async (c: Context) => {
        const gigId = c.req.param("gigId")
        const jsonBody = await c.req.json()
        const { message, gig } = await gigHndlr.updateGig(gigId, jsonBody)

        redis.setDataToCache(`gig:${gig._id}`, { gig: gig }, 60 * 60)
        return c.json({ message, gig }, StatusCodes.OK)
    })

    api.put("/gig/active-status/:gigId", async (c: Context) => {
        const gigId = c.req.param("gigId")
        const jsonBody = await c.req.json()
        const { message, gig } = await gigHndlr.updateGigActiveStatus(
            gigId,
            jsonBody
        )

        redis.setDataToCache(`gig:${gig._id}`, { gig: gig }, 60 * 60)
        return c.json({ message, gig }, StatusCodes.OK)
    })

    api.delete("/gig/:gigId/:sellerId", async (c: Context) => {
        const { gigId, sellerId } = c.req.param()
        const { message } = await gigHndlr.deleteGig(gigId, sellerId)

        redis.removeDataFromCache(`gig:${gigId}`)
        return c.json({ message }, StatusCodes.OK)
    })

    api.put("/gig/seed/:count", async (c: Context) => {
        const count = c.req.param("count")
        const { message } = await gigHndlr.populateGigs(count)

        return c.json({ message }, StatusCodes.OK)
    })
}
