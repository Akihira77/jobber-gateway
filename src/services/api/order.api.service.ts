import { AxiosResponse, AxiosInstance } from "axios"
import { AxiosService } from "@gateway/services/axios"
import { ORDER_BASE_URL } from "@gateway/config"
import {
    IDeliveredWork,
    IExtendedDelivery,
    IOrderDocument,
    IOrderMessage
} from "@Akihira77/jobber-shared"

// Axios provider for Authenticated User
export let axiosOrderInstance: AxiosInstance

class OrderService {
    // Axios general provider
    private readonly axiosService: AxiosService
    private readonly LIMIT_TIMEOUT: number

    constructor() {
        this.axiosService = new AxiosService(`${ORDER_BASE_URL}/order`, "order")
        axiosOrderInstance = this.axiosService.axios
        this.LIMIT_TIMEOUT = 3 * 1000 + 500
    }

    async createOrderIntent(
        buyerId: string,
        price: number
    ): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.post(
            "/create-payment-intent",
            { buyerId, price },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async createOrder(data: IOrderDocument): Promise<AxiosResponse> {
        let response = await axiosOrderInstance.post("", data, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getOrderByOrderId(id: string): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.get(`/${id}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getOrdersBySellerId(id: string): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.get(`/seller/${id}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async getOrdersByBuyerId(id: string): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.get(`/buyer/${id}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async approveOrder(
        orderId: string,
        data: IOrderMessage
    ): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.put(
            `/approve-order/${orderId}`,
            data,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async cancelOrder(
        orderId: string,
        data: IOrderMessage,
        paymentIntentId: string
    ): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.put(
            `/cancel/${orderId}`,
            { orderData: data, paymentIntentId },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async updateDeliveryDate(
        type: string,
        orderId: string,
        data: IExtendedDelivery
    ): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.put(
            `/gig/${type}/${orderId}`,
            data,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async requestDeliveryDateExtension(
        orderId: string,
        data: IExtendedDelivery
    ): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.put(
            `/extension/${orderId}`,
            data,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async deliverOrder(
        orderId: string,
        data: IDeliveredWork
    ): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.put(
            `/deliver-order/${orderId}`,
            data,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async getNotifications(userId: string): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.get(
            `/notifications/${userId}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async markNotificationAsRead(
        notificationId: string
    ): Promise<AxiosResponse> {
        const response = await axiosOrderInstance.put(
            "/notification/mark-as-read",
            {
                notificationId
            },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }
}

export const orderService = new OrderService()
