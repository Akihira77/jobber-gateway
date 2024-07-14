import { AxiosResponse, AxiosInstance } from "axios"
import { AxiosService } from "@gateway/services/axios"
import { AUTH_BASE_URL } from "@gateway/config"
import { IAuth } from "@Akihira77/jobber-shared"

// Axios provider for Authenticated User
export let axiosAuthInstance: AxiosInstance

class AuthService {
    // Axios general provider
    private readonly axiosService: AxiosService
    private readonly LIMIT_TIMEOUT: number

    constructor() {
        this.axiosService = new AxiosService(`${AUTH_BASE_URL}/auth`, "auth")
        axiosAuthInstance = this.axiosService.axios
        this.LIMIT_TIMEOUT = 3 * 1000 + 500
    }

    async getCurrentUser(): Promise<AxiosResponse> {
        const response = await axiosAuthInstance.get("/current-user", {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getRefreshToken(username: string): Promise<AxiosResponse> {
        const response = await axiosAuthInstance.get(
            `/refresh-token/${username}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async resendEmail(request: {
        userId: number
        email: string
    }): Promise<AxiosResponse> {
        const response = await axiosAuthInstance.post(
            "/resend-verification-email",
            request,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async verifyEmail(token: string): Promise<AxiosResponse> {
        const response = await axiosAuthInstance.put(
            "/verify-email",
            { token },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async changePassword(
        currentPassword: string,
        newPassword: string
    ): Promise<AxiosResponse> {
        const response = await axiosAuthInstance.put("/change-password", {
            currentPassword,
            newPassword
        })

        return response
    }

    async signUp(request: IAuth): Promise<AxiosResponse> {
        const response = await this.axiosService.axios.post("/signup", request)

        return response
    }

    async signIn(request: IAuth): Promise<AxiosResponse> {
        let response = await this.axiosService.axios.post("/signin", request, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async forgotPassword(email: string): Promise<AxiosResponse> {
        const response = await this.axiosService.axios.put("/forgot-password", {
            email
        })

        return response
    }

    async resetPassword(
        token: string,
        password: string,
        confirmPassword: string
    ): Promise<AxiosResponse> {
        const response = await this.axiosService.axios.put(
            `/reset-password/${token}`,
            { password, confirmPassword },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    getGigs(
        query: string,
        from: string,
        size: string,
        type: string
    ): Promise<AxiosResponse> {
        return this.axiosService.makeRequestWithRetry(
            this.axiosService.axios.get(
                `/search/gig/${from}/${size}/${type}?${query}`,
                {
                    signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
                }
            ),
            3
        )
    }

    async getGigById(id: string): Promise<AxiosResponse> {
        let response = await this.axiosService.axios.get(`/search/gig/${id}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async seed(count: string): Promise<AxiosResponse> {
        const response = await this.axiosService.axios.put(`/seed/${count}`)

        return response
    }
}

export const authService = new AuthService()
