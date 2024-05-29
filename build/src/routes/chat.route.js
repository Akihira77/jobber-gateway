"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const auth_middleware_1 = require("../services/auth-middleware");
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
class ChatRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new chat_controller_1.ChatController();
    }
    routes() {
        this.router.post("/message", auth_middleware_1.authMiddleware.verifyAuth, this.controller.addMessage);
        this.router.put("/message/offer", auth_middleware_1.authMiddleware.verifyAuth, this.controller.updateOffer);
        this.router.put("/message/mark-as-read", auth_middleware_1.authMiddleware.verifyAuth, this.controller.markSingleMessageAsRead);
        this.router.put("/message/mark-multiple-as-read", auth_middleware_1.authMiddleware.verifyAuth, this.controller.markSingleMessageAsRead);
        this.router.get("/message/conversation/:senderUsername/:receiverUsername", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getConversation);
        this.router.get("/message/conversations/:username", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getConversationList);
        this.router.get("/message/:senderUsername/:receiverUsername", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getMessages);
        this.router.get("/message/:conversationId", auth_middleware_1.authMiddleware.verifyAuth, this.controller.getUserMessages);
        return this.router;
    }
}
exports.messageRoutes = new ChatRoutes();
//# sourceMappingURL=chat.route.js.map