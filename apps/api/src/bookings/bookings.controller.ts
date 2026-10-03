import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('v1/booking')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('ai-parse')
  async parseWithAI(@Body() body: { prompt: string; language: string }) {
    return this.bookingsService.parseWithAI(body.prompt, body.language);
  }

  @Post('find-drivers')
  async findDrivers(@Body() body: any) {
    return this.bookingsService.findDrivers(body);
  }

  @Post('confirm')
  async confirmBooking(@Body() body: { offer: any }) {
    return this.bookingsService.confirmBooking(body.offer);
  }
}
