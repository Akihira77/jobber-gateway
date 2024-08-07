import { AuthMiddleware } from "@gateway/services/auth-middleware"
import { buyerRoute } from "@gateway/routes/buyer.route"
import { sellerRoute } from "@gateway/routes/seller.route"
import { gigRoute } from "@gateway/routes/gig.route"
import { chatRoute } from "@gateway/routes/chat.route"
import { Context, Hono } from "hono"
import { StatusCodes } from "http-status-codes"

import { RedisClient } from "./redis/gateway.redis"
import { unauthRoute } from "./routes/unauth.route"
import { authRoute } from "./routes/auth.route"
import { orderRoute } from "./routes/order.route"
import { reviewRoute } from "./routes/review.route"

// export const BASE_PATH = "/api/gateway/v1"
export const BASE_PATH = "/gateway"

export const appRoutes = (app: Hono, redis: RedisClient) => {
    app.get("gateway-health", (c: Context) => {
        return c.text("API Gateway service is healthy and OK.", StatusCodes.OK)
    })

    const api = app.basePath(BASE_PATH)
    const authMiddleware = new AuthMiddleware()

    unauthRoute(api, redis)

    api.use(authMiddleware.authOnly)
    authRoute(api, redis)
    buyerRoute(api, redis)
    sellerRoute(api, redis)
    chatRoute(api)
    gigRoute(api, redis)
    orderRoute(api)
    reviewRoute(api)
}
