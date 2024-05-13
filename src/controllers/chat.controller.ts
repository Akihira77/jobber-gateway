import { messageService } from "@gateway/services/api/chat.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class ChatController {
    public async getConversation(req: Request, res: Response): Promise<void> {
        const response = await messageService.getConversation(
            req.params.senderUsername,
            req.params.receiverUsername
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            conversations: response.data.conversations
        });
    }

    public async getMessages(req: Request, res: Response): Promise<void> {
        const response = await messageService.getMessages(
            req.params.senderUsername,
            req.params.receiverUsername
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            messages: response.data.messages
        });
    }

    public async getConversationList(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await messageService.getConversationList(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            conversations: response.data.conversations
        });
    }

    public async getUserMessages(req: Request, res: Response): Promise<void> {
        const response = await messageService.getUserMessages(
            req.params.conversationId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            messages: response.data.messages
        });
    }

    public async addMessage(req: Request, res: Response): Promise<void> {
        const response = await messageService.addMessage(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            conversationId: response.data.conversationId,
            messageData: response.data.messageData
        });
    }

    public async updateOffer(req: Request, res: Response): Promise<void> {
        const response = await messageService.updateOffer(
            req.body.messageId,
            req.body.type
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            singleMessage: response.data.singleMessage
        });
    }

    public async markSingleMessageAsRead(
        req: Request,
        res: Response
    ): Promise<void> {
        const response = await messageService.markMessageAsRead(
            req.body.messageId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            singleMessage: response.data.singleMessage
        });
    }

    public async markMultipleMessagesAsRead(
        req: Request,
        res: Response
    ): Promise<void> {
        const { messageId, senderUsername, receiverUsername } = req.body;
        const response = await messageService.markMultipleMessagesAsRead(
            messageId,
            senderUsername,
            receiverUsername
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message
        });
    }
}
