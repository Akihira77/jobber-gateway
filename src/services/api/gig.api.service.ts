import { AxiosResponse, AxiosInstance } from "axios"
import { AxiosService } from "@gateway/services/axios"
import { GIG_BASE_URL } from "@gateway/config"
import { ISellerGig } from "@Akihira77/jobber-shared"

// Axios provider for Authenticated User
export let axiosGigInstance: AxiosInstance

class GigService {
    // Axios general provider
    private readonly axiosService: AxiosService
    private readonly LIMIT_TIMEOUT: number

    constructor() {
        this.axiosService = new AxiosService(`${GIG_BASE_URL}/gig`, "gig")
        axiosGigInstance = this.axiosService.axios
        this.LIMIT_TIMEOUT = 3 * 1000 + 500
    }

    async getGigById(id: string): Promise<AxiosResponse> {
        let response = await axiosGigInstance.get(`/${id}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getSellerActiveGigs(sellerId: string): Promise<AxiosResponse> {
        let response = await axiosGigInstance.get(`/seller/${sellerId}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })
        return response
    }

    async getSellerInactiveGigs(sellerId: string): Promise<AxiosResponse> {
        let response = await axiosGigInstance.get(
            `/seller/inactive/${sellerId}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )
        return response
    }

    async getGigsByCategory(username: string): Promise<AxiosResponse> {
        let response = await axiosGigInstance.get(`/category/${username}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })
        return response
    }

    async getMoreGigsLikeThis(gigId: string): Promise<AxiosResponse> {
        let response = await axiosGigInstance.get(`/similar/${gigId}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })
        return response
    }

    async getTopRatedGigsByCategory(username: string): Promise<AxiosResponse> {
        let response = await axiosGigInstance.get(`/top/${username}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })
        return response
    }

    async searchGigs(
        query: string,
        from: string,
        size: string,
        type: string
    ): Promise<AxiosResponse> {
        let response = await axiosGigInstance.get(
            `/search/${from}/${size}/${type}?${query}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )
        return response
    }

    async createGig(request: ISellerGig): Promise<AxiosResponse> {
        let response = await axiosGigInstance.post("/create", request, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })
        return response
    }

    async updateGig(
        gigId: string,
        request: ISellerGig
    ): Promise<AxiosResponse> {
        let response = await axiosGigInstance.put(`/update/${gigId}`, request, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })
        return response
    }

    async updateGigActiveStatus(
        gigId: string,
        active: boolean
    ): Promise<AxiosResponse> {
        let response = await axiosGigInstance.put(
            `/status/${gigId}`,
            {
                active
            },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )
        return response
    }

    async deleteGig(gigId: string, sellerId: string): Promise<AxiosResponse> {
        let response = await axiosGigInstance.delete(`/${gigId}/${sellerId}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })
        return response
    }

    async seed(count: string): Promise<AxiosResponse> {
        let response = await axiosGigInstance.put(`/seed/${count}`)
        return response
    }
}

export const gigService = new GigService()
