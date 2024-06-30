import axios, { AxiosResponse } from "axios"
import { AxiosService } from "@gateway/services/axios"
import { REVIEW_BASE_URL } from "@gateway/config"
import { IReviewDocument } from "@Akihira77/jobber-shared"

export let axiosReviewInstance: ReturnType<typeof axios.create>

class ReviewService {
    // Axios general provider
    axiosService: AxiosService

    constructor() {
        this.axiosService = new AxiosService(
            `${REVIEW_BASE_URL}/review`,
            "review"
        )
        axiosReviewInstance = this.axiosService.axios
    }

    async getReviewsByGigId(id: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosReviewInstance.get(
            `/gig/${id}`
        )

        return response
    }

    async getReviewsBySellerId(id: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosReviewInstance.get(
            `/seller/${id}`
        )

        return response
    }

    async addReview(data: IReviewDocument): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosReviewInstance.post(
            "/",
            data
        )

        return response
    }
}

export const reviewService = new ReviewService()
