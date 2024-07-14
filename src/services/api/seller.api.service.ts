import { AxiosResponse, AxiosInstance } from "axios"
import { AxiosService } from "@gateway/services/axios"
import { USERS_BASE_URL } from "@gateway/config"
import { ISellerDocument } from "@Akihira77/jobber-shared"

// Axios provider for Authenticated User
export let axiosSellerInstance: AxiosInstance

class SellerService {
    // Axios general provider
    private readonly axiosService: AxiosService
    private readonly LIMIT_TIMEOUT: number

    constructor() {
        this.axiosService = new AxiosService(
            `${USERS_BASE_URL}/seller`,
            "seller"
        )
        axiosSellerInstance = this.axiosService.axios
        this.LIMIT_TIMEOUT = 3 * 1000 + 500
    }

    async getSellerById(id: string): Promise<AxiosResponse> {
        let response = await axiosSellerInstance.get(`/id/${id}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getSellerByUsername(username: string): Promise<AxiosResponse> {
        let response = await axiosSellerInstance.get(`/username/${username}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getRandomSellers(count: string): Promise<AxiosResponse> {
        let response = await axiosSellerInstance.get(`/random/${count}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async createSeller(request: ISellerDocument): Promise<AxiosResponse> {
        let response = await axiosSellerInstance.post("/create", request, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async updateSeller(
        sellerId: string,
        request: ISellerDocument
    ): Promise<AxiosResponse> {
        let response = await axiosSellerInstance.put(`/${sellerId}`, request, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async seed(count: string): Promise<AxiosResponse> {
        let response = await axiosSellerInstance.put(`/seed/${count}`)

        return response
    }
}

export const sellerService = new SellerService()
