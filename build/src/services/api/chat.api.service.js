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
exports.messageService = exports.axiosChatInstance = void 0;
const axios_1 = require("../../services/axios");
const config_1 = require("../../config");
class ChatService {
    constructor() {
        this.axiosService = new axios_1.AxiosService(`${config_1.MESSAGE_BASE_URL}/message`, "message");
        exports.axiosChatInstance = this.axiosService.axios;
    }
    getConversation(senderUsername, receiverUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosChatInstance.get(`/conversation/${senderUsername}/${receiverUsername}`);
            return response;
        });
    }
    getMessages(senderUsername, receiverUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosChatInstance.get(`/${senderUsername}/${receiverUsername}`);
            return response;
        });
    }
    getConversationList(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosChatInstance.get(`/conversations/${username}`);
            return response;
        });
    }
    getUserMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosChatInstance.get(`/${conversationId}`);
            return response;
        });
    }
    addMessage(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosChatInstance.post("/", request);
            return response;
        });
    }
    markMessageAsRead(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosChatInstance.put("/mark-as-read", { messageId });
            return response;
        });
    }
    markMultipleMessagesAsRead(messageId, senderUsername, receiverUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosChatInstance.put("/mark-multiple-as-read", { senderUsername, receiverUsername, messageId });
            return response;
        });
    }
    updateOffer(messageId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield exports.axiosChatInstance.put("/offer", {
                type,
                messageId
            });
            return response;
        });
    }
}
exports.messageService = new ChatService();
//# sourceMappingURL=chat.api.service.js.map