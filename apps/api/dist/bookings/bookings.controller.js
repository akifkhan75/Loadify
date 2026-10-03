var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { AuthGuard } from '@nestjs/passport';
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async parseWithAI(body) {
        return this.bookingsService.parseWithAI(body.prompt, body.language);
    }
    async findDrivers(body) {
        return this.bookingsService.findDrivers(body);
    }
    async confirmBooking(body) {
        return this.bookingsService.confirmBooking(body.offer);
    }
};
__decorate([
    Post('ai-parse'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "parseWithAI", null);
__decorate([
    Post('find-drivers'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findDrivers", null);
__decorate([
    Post('confirm'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "confirmBooking", null);
BookingsController = __decorate([
    UseGuards(AuthGuard('jwt')),
    Controller('v1/booking'),
    __metadata("design:paramtypes", [BookingsService])
], BookingsController);
export { BookingsController };
//# sourceMappingURL=bookings.controller.js.map