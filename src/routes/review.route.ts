import { ReviewHandler } from "@gateway/handler/review.handler"
import { BASE_PATH } from "@gateway/routes"
import { Context, Hono } from "hono"
import { StatusCodes } from "http-status-codes"

export function reviewRoute(
    api: Hono<Record<string, never>, Record<string, never>, typeof BASE_PATH>
): void {
    const reviewHndlr = new ReviewHandler()

    api.get("/review/gig/:gigId", async (c: Context) => {
        const gigId = c.req.param("gigId")
        const { message, reviews } = await reviewHndlr.getReviewsByGigId(gigId)

        return c.json({ message, reviews }, StatusCodes.OK)
    })
    api.get("/review/seller/:sellerId", async (c: Context) => {
        const sellerId = c.req.param("sellerId")
        const { message, reviews } =
            await reviewHndlr.getReviewsBySellerId(sellerId)

        return c.json({ message, reviews }, StatusCodes.OK)
    })

    api.post("/review", async (c: Context) => {
        const jsonBody = await c.req.json()
        const { message, review } = await reviewHndlr.addReview(jsonBody)

        return c.json({ message, review }, StatusCodes.OK)
    })
}
