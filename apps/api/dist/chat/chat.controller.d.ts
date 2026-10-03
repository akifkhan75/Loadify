import { ChatService } from './chat.service.js';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChatHistory(chatId: string): Promise<{
        id: string;
        createdAt: Date;
        chatId: string;
        senderId: string;
        text: string;
    }[]>;
    sendMessage(chatId: string, body: {
        senderId: string;
        text: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        chatId: string;
        senderId: string;
        text: string;
    }>;
}
