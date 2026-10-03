import { PrismaService } from '../prisma/prisma.service.js';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    parseWithAI(prompt: string, language: string): Promise<{
        pickupLocation: string;
        dropoffLocation: string;
        estimatedDistance: number;
        suggestedVehicle: string;
        serviceLevel: string;
        isSchedule: boolean;
    }>;
    findDrivers(criteria: any): Promise<({
        account: {
            mobile: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            firstName: string | null;
            lastName: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        accountId: string;
        isOnline: boolean;
        vehicleType: string | null;
    })[]>;
    confirmBooking(offer: any): Promise<{
        bookingId: string;
        driver: any;
    }>;
}
