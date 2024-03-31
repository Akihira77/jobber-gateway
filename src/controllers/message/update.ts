import { messageService } from "@gateway/services/api/message.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Update {
    public async offer(req: Request, res: Response): Promise<void> {
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
