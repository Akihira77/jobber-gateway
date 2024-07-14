import { AxiosResponse, AxiosInstance } from "axios"
import { AxiosService } from "@gateway/services/axios"
import { REVIEW_BASE_URL } from "@gateway/config"
import { IReviewDocument } from "@Akihira77/jobber-shared"

export let axiosReviewInstance: AxiosInstance

class ReviewService {
    // Axios general provider
    private readonly axiosService: AxiosService
    private readonly LIMIT_TIMEOUT: number

    constructor() {
        this.axiosService = new AxiosService(
            `${REVIEW_BASE_URL}/review`,
            "review"
        )
        axiosReviewInstance = this.axiosService.axios
        this.LIMIT_TIMEOUT = 3 * 1000 + 500
    }

    async getReviewsByGigId(id: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosReviewInstance.get(
            `/gig/${id}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async getReviewsBySellerId(id: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosReviewInstance.get(
            `/seller/${id}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async addReview(data: IReviewDocument): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosReviewInstance.post(
            "",
            data,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }
}

export const reviewService = new ReviewService()
