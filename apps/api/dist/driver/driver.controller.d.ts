import { DriverService } from './driver.service.js';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    getDashboard(driverId: string): Promise<{
        isOnline: boolean;
        requests: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rideRequestId: string;
            driverId: string;
            status: string;
        }[];
    }>;
    respondToRequest(requestId: string, body: {
        response: string;
        newTime?: string;
    }): Promise<{
        success: boolean;
    }>;
}
