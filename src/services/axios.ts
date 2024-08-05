import Axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    isAxiosError
} from "axios"
import { createSigner } from "fast-jwt"
import { GATEWAY_JWT_TOKEN } from "@gateway/config"
import axiosRetry from "axios-retry"
import axiosRateLimiter from "axios-rate-limit"

export class AxiosService {
    public axios: AxiosInstance

    constructor(baseUrl: string, serviceName: string) {
        this.axios = this.axiosCreateInstance(baseUrl, serviceName)
    }

    public axiosCreateInstance(
        baseUrl: string,
        serviceName?: string
    ): AxiosInstance {
        let gatewaytoken = ""
        if (serviceName) {
            const signer = createSigner({
                key: `${GATEWAY_JWT_TOKEN}`,
                expiresIn: "1d",
                iss: "Jobber Auth",
                algorithm: "HS512"
            })
            gatewaytoken = signer({ id: serviceName })
        }

        const LIMIT_TIMEOUT = 3 * 1000 + 500 // ms
        const instance: AxiosInstance = Axios.create({
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json",
                "X-Request-From": serviceName ?? "API Gateway",
                Accept: "application/json",
                gatewaytoken
            },
            timeout: LIMIT_TIMEOUT,
            validateStatus: (status: number) => {
                return 100 <= status && status < 400
            },
            withCredentials: true,
            timeoutErrorMessage: "The request takes too long"
        })

        // const axios = setupCache(instance, {
        //     storage: buildStorage({
        //         set: (key: string, value: any): MaybePromise<void> => {
        //             this.redis.setDataToCache(key, value, 5 * 60)
        //             return
        //         },

        //         find: async (
        //             key: string
        //         ): Promise<StorageValue | undefined> => {
        //             const cachedData = await this.redis.getDataFromCache(key)
        //             if (cachedData) {
        //                 const jsonData = typia.json.isParse<any>(cachedData)
        //                 return jsonData
        //             }

        //             return undefined
        //         },

        //         remove: (key: string) => {
        //             this.redis.removeDataFromCache(key)
        //         }
        //     })
        // })

        axiosRetry(instance, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error: AxiosError) => {
                console.log(
                    `${error.message} - ${error.config?.baseURL}/${error.config?.url}`
                )
                return axiosRetry.isNetworkOrIdempotentRequestError(error)
            }
        })

        axiosRateLimiter(instance, {
            maxRequests: 1000,
            perMilliseconds: 1000
        })

        return instance
    }

    public async makeRequestWithRetry(
        res: Promise<AxiosResponse>,
        maxRetries: number = 3
    ): Promise<AxiosResponse> {
        let retries = 0
        while (retries < maxRetries) {
            try {
                const response = await res
                return response
            } catch (error) {
                if (isAxiosError(error) && error.code === "ECONNRESET") {
                    console.log("Connection reset, retrying...")
                    retries++
                } else {
                    throw error
                }
            }
        }

        throw new Error(
            `Failed to establish connection after ${maxRetries} retries.`
        )
    }
}
