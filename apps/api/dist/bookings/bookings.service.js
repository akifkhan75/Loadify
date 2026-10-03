var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async parseWithAI(prompt, language) {
        return {
            pickupLocation: "Parsed Pickup",
            dropoffLocation: "Parsed Dropoff",
            estimatedDistance: 10,
            suggestedVehicle: "Truck",
            serviceLevel: "STANDARD",
            isSchedule: false
        };
    }
    async findDrivers(criteria) {
        return await this.prisma.driverProfile.findMany({
            where: { isOnline: true },
            include: { account: true }
        });
    }
    async confirmBooking(offer) {
        return { bookingId: "123", driver: offer };
    }
};
BookingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BookingsService);
export { BookingsService };
//# sourceMappingURL=bookings.service.js.map