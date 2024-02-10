import { messageService } from "@gateway/services/api/message.api.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Create {
    public async message(req: Request, res: Response): Promise<void> {
        const response = await messageService.addMessage(req.body);

        res.status(StatusCodes.CREATED).json({
            message: response.data.message,
            conversationId: response.data.conversationId,
            messageData: response.data.messageData
        });
    }
}
