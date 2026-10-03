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
let DriverService = class DriverService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(driverId) {
        const driver = await this.prisma.driverProfile.findUnique({
            where: { accountId: driverId },
            include: { driverOffers: true }
        });
        return { isOnline: driver?.isOnline || false, requests: driver?.driverOffers || [] };
    }
    async respondToRequest(requestId, response, newTime) {
        return { success: true };
    }
};
DriverService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DriverService);
export { DriverService };
//# sourceMappingURL=driver.service.js.map