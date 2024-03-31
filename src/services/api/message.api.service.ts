import axios, { AxiosResponse } from "axios";
import { AxiosService } from "@gateway/services/axios";
import { MESSAGE_BASE_URL } from "@gateway/config";
import { IMessageDocument } from "@Akihira77/jobber-shared";

export let axiosMessageInstance: ReturnType<typeof axios.create>;

class MessageService {
    // Axios general provider
    axiosService: AxiosService;

    constructor() {
        this.axiosService = new AxiosService(
            `${MESSAGE_BASE_URL}/api/v1/message`,
            "message"
        );
        axiosMessageInstance = this.axiosService.axios;
    }

    async getConversation(
        senderUsername: string,
        receiverUsername: string
    ): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosMessageInstance.get(
            `/conversation/${senderUsername}/${receiverUsername}`
        );

        return response;
    }

    async getMessages(
        senderUsername: string,
        receiverUsername: string
    ): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosMessageInstance.get(
            `/${senderUsername}/${receiverUsername}`
        );

        return response;
    }

    async getConversationList(username: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosMessageInstance.get(
            `/conversations/${username}`
        );

        return response;
    }

    async getUserMessages(conversationId: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosMessageInstance.get(
            `/${conversationId}`
        );

        return response;
    }

    async addMessage(request: IMessageDocument): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosMessageInstance.post(
            "/",
            request
        );

        return response;
    }

    async markMessageAsRead(messageId: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosMessageInstance.put(
            `/mark-as-read`,
            { messageId }
        );

        return response;
    }

    async markMultipleMessagesAsRead(
        messageId: string,
        senderUsername: string,
        receiverUsername: string
    ): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosMessageInstance.put(
            `/mark-multiple-as-read`,
            { senderUsername, receiverUsername, messageId }
        );

        return response;
    }

    async updateOffer(messageId: string, type: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosMessageInstance.put(
            `/offer`,
            { type, messageId }
        );

        return response;
    }
}

export const messageService = new MessageService();
