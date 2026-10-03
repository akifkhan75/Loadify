import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { ChatModule } from './chat/chat.module.js';
import { DriverModule } from './driver/driver.module.js';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, BookingsModule, ChatModule, DriverModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
