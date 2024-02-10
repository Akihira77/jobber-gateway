import { messageService } from "@gateway/services/api/message.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Get {
    public async conversation(req: Request, res: Response): Promise<void> {
        const response = await messageService.getConversation(
            req.params.senderUsername,
            req.params.receiverUsername
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            conversations: response.data.conversations
        });
    }

    public async messages(req: Request, res: Response): Promise<void> {
        const response = await messageService.getMessages(
            req.params.senderUsername,
            req.params.receiverUsername
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            messages: response.data.messages
        });
    }

    public async conversationList(req: Request, res: Response): Promise<void> {
        const response = await messageService.getConversationList(
            req.params.username
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            conversations: response.data.conversations
        });
    }

    public async userMessages(req: Request, res: Response): Promise<void> {
        const response = await messageService.getUserMessages(
            req.params.conversationId
        );

        res.status(StatusCodes.OK).json({
            message: response.data.message,
            messages: response.data.messages
        });
    }
}
