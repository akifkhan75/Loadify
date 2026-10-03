import { PrismaService } from '../prisma/prisma.service.js';
export declare class DriverService {
    private prisma;
    constructor(prisma: PrismaService);
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
    respondToRequest(requestId: string, response: string, newTime?: string): Promise<{
        success: boolean;
    }>;
}
