import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(driverId: string) {
    const driver = await this.prisma.driverProfile.findUnique({
      where: { accountId: driverId },
      include: { driverOffers: true }
    });
    return { isOnline: driver?.isOnline || false, requests: driver?.driverOffers || [] };
  }

  async respondToRequest(requestId: string, response: string, newTime?: string) {
    return { success: true };
  }
}
