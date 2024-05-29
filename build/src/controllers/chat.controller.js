"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_api_service_1 = require("../services/api/chat.api.service");
const http_status_codes_1 = require("http-status-codes");
class ChatController {
    getConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield chat_api_service_1.messageService.getConversation(req.params.senderUsername, req.params.receiverUsername);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                conversations: response.data.conversations
            });
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield chat_api_service_1.messageService.getMessages(req.params.senderUsername, req.params.receiverUsername);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                messages: response.data.messages
            });
        });
    }
    getConversationList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield chat_api_service_1.messageService.getConversationList(req.params.username);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                conversations: response.data.conversations
            });
        });
    }
    getUserMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield chat_api_service_1.messageService.getUserMessages(req.params.conversationId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                messages: response.data.messages
            });
        });
    }
    addMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield chat_api_service_1.messageService.addMessage(req.body);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: response.data.message,
                conversationId: response.data.conversationId,
                messageData: response.data.messageData
            });
        });
    }
    updateOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield chat_api_service_1.messageService.updateOffer(req.body.messageId, req.body.type);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                singleMessage: response.data.singleMessage
            });
        });
    }
    markSingleMessageAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield chat_api_service_1.messageService.markMessageAsRead(req.body.messageId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message,
                singleMessage: response.data.singleMessage
            });
        });
    }
    markMultipleMessagesAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, senderUsername, receiverUsername } = req.body;
            const response = yield chat_api_service_1.messageService.markMultipleMessagesAsRead(messageId, senderUsername, receiverUsername);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: response.data.message
            });
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map