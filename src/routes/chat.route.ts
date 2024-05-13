import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";
import { ChatController } from "@gateway/controllers/chat.controller";

class ChatRoutes {
    private router: Router;
    private controller: ChatController;

    constructor() {
        this.router = express.Router();
        this.controller = new ChatController();
    }

    public routes(): Router {
        this.router.post(
            "/message",
            authMiddleware.verifyAuth,
            this.controller.addMessage
        );

        this.router.put(
            "/message/offer",
            authMiddleware.verifyAuth,
            this.controller.updateOffer
        );
        this.router.put(
            "/message/mark-as-read",
            authMiddleware.verifyAuth,
            this.controller.markSingleMessageAsRead
        );
        this.router.put(
            "/message/mark-multiple-as-read",
            authMiddleware.verifyAuth,
            this.controller.markSingleMessageAsRead
        );

        this.router.get(
            "/message/conversation/:senderUsername/:receiverUsername",
            authMiddleware.verifyAuth,
            this.controller.getConversation
        );
        this.router.get(
            "/message/conversations/:username",
            authMiddleware.verifyAuth,
            this.controller.getConversationList
        );
        this.router.get(
            "/message/:senderUsername/:receiverUsername",
            authMiddleware.verifyAuth,
            this.controller.getMessages
        );
        this.router.get(
            "/message/:conversationId",
            authMiddleware.verifyAuth,
            this.controller.getUserMessages
        );

        return this.router;
    }
}

export const messageRoutes = new ChatRoutes();
