import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service.js';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('v1/driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('dashboard/:driverId')
  async getDashboard(@Param('driverId') driverId: string) {
    return this.driverService.getDashboard(driverId);
  }

  @Post('requests/:requestId/respond')
  async respondToRequest(@Param('requestId') requestId: string, @Body() body: { response: string, newTime?: string }) {
    return this.driverService.respondToRequest(requestId, body.response, body.newTime);
  }
}
