import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatId')
  async getChatHistory(@Param('chatId') chatId: string) {
    return this.chatService.getChatHistory(chatId);
  }

  @Post(':chatId/message')
  async sendMessage(@Param('chatId') chatId: string, @Body() body: { senderId: string, text: string }) {
    return this.chatService.sendMessage(chatId, body.senderId, body.text);
  }
}
