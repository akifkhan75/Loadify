import { PrismaService } from '../prisma/prisma.service.js';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getChatHistory(chatId: string): Promise<{
        id: string;
        createdAt: Date;
        chatId: string;
        senderId: string;
        text: string;
    }[]>;
    sendMessage(chatId: string, senderId: string, text: string): Promise<{
        id: string;
        createdAt: Date;
        chatId: string;
        senderId: string;
        text: string;
    }>;
}
