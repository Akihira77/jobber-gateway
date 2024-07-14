import { AxiosResponse, AxiosInstance } from "axios"
import { AxiosService } from "@gateway/services/axios"
import { MESSAGE_BASE_URL } from "@gateway/config"
import { IMessageDocument } from "@Akihira77/jobber-shared"

export let axiosChatInstance: AxiosInstance

class ChatService {
    // Axios general provider
    private readonly axiosService: AxiosService
    private readonly LIMIT_TIMEOUT: number

    constructor() {
        this.axiosService = new AxiosService(
            `${MESSAGE_BASE_URL}/message`,
            "message"
        )
        axiosChatInstance = this.axiosService.axios
        this.LIMIT_TIMEOUT = 3 * 1000 + 500
    }

    async getConversation(
        senderUsername: string,
        receiverUsername: string
    ): Promise<AxiosResponse> {
        const response = await axiosChatInstance.get(
            `/conversation/${senderUsername}/${receiverUsername}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async getMessages(
        senderUsername: string,
        receiverUsername: string
    ): Promise<AxiosResponse> {
        const response = await axiosChatInstance.get(
            `/${senderUsername}/${receiverUsername}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async getConversationList(username: string): Promise<AxiosResponse> {
        const response = await axiosChatInstance.get(
            `/conversations/${username}`,
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async getUserMessages(conversationId: string): Promise<AxiosResponse> {
        const response = await axiosChatInstance.get(`/${conversationId}`, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async addMessage(request: IMessageDocument): Promise<AxiosResponse> {
        let response = await axiosChatInstance.post("", request, {
            signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
        })

        return response
    }

    async markMessageAsRead(messageId: string): Promise<AxiosResponse> {
        const response = await axiosChatInstance.put(
            "/mark-as-read",
            { messageId },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async markMultipleMessagesAsRead(
        messageId: string,
        senderUsername: string,
        receiverUsername: string
    ): Promise<AxiosResponse> {
        const response = await axiosChatInstance.put(
            "/mark-multiple-as-read",
            { senderUsername, receiverUsername, messageId },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }

    async updateOffer(messageId: string, type: string): Promise<AxiosResponse> {
        const response = await axiosChatInstance.put(
            "/offer",
            {
                type,
                messageId
            },
            {
                signal: AbortSignal.timeout(this.LIMIT_TIMEOUT)
            }
        )

        return response
    }
}

export const messageService = new ChatService()
