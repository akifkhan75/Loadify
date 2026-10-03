import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async parseWithAI(prompt: string, language: string) {
    // In real app, connect to Gemini here.
    return {
      pickupLocation: "Parsed Pickup",
      dropoffLocation: "Parsed Dropoff",
      estimatedDistance: 10,
      suggestedVehicle: "Truck",
      serviceLevel: "STANDARD",
      isSchedule: false
    };
  }

  async findDrivers(criteria: any) {
    return await this.prisma.driverProfile.findMany({
      where: { isOnline: true },
      include: { account: true }
    });
  }

  async confirmBooking(offer: any) {
    return { bookingId: "123", driver: offer };
  }
}
