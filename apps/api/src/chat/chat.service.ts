import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChatHistory(chatId: string) {
    return this.prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });
  }

  async sendMessage(chatId: string, senderId: string, text: string) {
    return this.prisma.chatMessage.create({
      data: { chatId, senderId, text }
    });
  }
}
