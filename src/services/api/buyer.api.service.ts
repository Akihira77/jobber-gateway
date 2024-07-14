import { AxiosResponse, AxiosInstance } from "axios"
import { AxiosService } from "@gateway/services/axios"
import { USERS_BASE_URL } from "@gateway/config"

// Axios provider for Authenticated User
export let axiosBuyerInstance: AxiosInstance

class BuyerService {
    // Axios general provider
    private readonly axiosService: AxiosService
    private readonly LIMIT_TIMEOUT: number

    constructor() {
        this.axiosService = new AxiosService(`${USERS_BASE_URL}/buyer`, "buyer")
        axiosBuyerInstance = this.axiosService.axios
        this.LIMIT_TIMEOUT = 3 * 1000 + 500
    }

    async getCurrentBuyerByUsername(): Promise<AxiosResponse> {
        const response = await axiosBuyerInstance.get("/username", {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getBuyerByUsername(username: string): Promise<AxiosResponse> {
        const response = await axiosBuyerInstance.get(`${username}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getBuyerByEmail(): Promise<AxiosResponse> {
        const response = await axiosBuyerInstance.get("/email", {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }
}

export const buyerService = new BuyerService()
