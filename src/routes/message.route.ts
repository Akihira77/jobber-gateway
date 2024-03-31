import { authMiddleware } from "@gateway/services/auth-middleware";
import express, { Router } from "express";
import { Create } from "@gateway/controllers/message/create";
import { Update } from "@gateway/controllers/message/update";
import { Get } from "@gateway/controllers/message/get";

class MessageRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post(
            "/message",
            authMiddleware.checkAuthentication,
            Create.prototype.message
        );

        this.router.put(
            "/message/offer",
            authMiddleware.checkAuthentication,
            Update.prototype.offer
        );
        this.router.put(
            "/message/mark-as-read",
            authMiddleware.checkAuthentication,
            Update.prototype.markSingleMessageAsRead
        );
        this.router.put(
            "/message/mark-multiple-as-read",
            authMiddleware.checkAuthentication,
            Update.prototype.markSingleMessageAsRead
        );

        this.router.get(
            "/message/conversation/:senderUsername/:receiverUsername",
            authMiddleware.checkAuthentication,
            Get.prototype.conversation
        );
        this.router.get(
            "/message/conversations/:username",
            authMiddleware.checkAuthentication,
            Get.prototype.conversationList
        );
        this.router.get(
            "/message/:senderUsername/:receiverUsername",
            authMiddleware.checkAuthentication,
            Get.prototype.messages
        );
        this.router.get(
            "/message/:conversationId",
            authMiddleware.checkAuthentication,
            Get.prototype.userMessages
        );

        return this.router;
    }
}

export const messageRoutes = new MessageRoutes();
