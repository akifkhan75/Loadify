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
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service.js';
import { AuthGuard } from '@nestjs/passport';
let DriverController = class DriverController {
    driverService;
    constructor(driverService) {
        this.driverService = driverService;
    }
    async getDashboard(driverId) {
        return this.driverService.getDashboard(driverId);
    }
    async respondToRequest(requestId, body) {
        return this.driverService.respondToRequest(requestId, body.response, body.newTime);
    }
};
__decorate([
    Get('dashboard/:driverId'),
    __param(0, Param('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getDashboard", null);
__decorate([
    Post('requests/:requestId/respond'),
    __param(0, Param('requestId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "respondToRequest", null);
DriverController = __decorate([
    UseGuards(AuthGuard('jwt')),
    Controller('v1/driver'),
    __metadata("design:paramtypes", [DriverService])
], DriverController);
export { DriverController };
//# sourceMappingURL=driver.controller.js.map