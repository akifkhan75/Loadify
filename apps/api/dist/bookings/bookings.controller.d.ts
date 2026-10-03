import { BookingsService } from './bookings.service.js';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    parseWithAI(body: {
        prompt: string;
        language: string;
    }): Promise<{
        pickupLocation: string;
        dropoffLocation: string;
        estimatedDistance: number;
        suggestedVehicle: string;
        serviceLevel: string;
        isSchedule: boolean;
    }>;
    findDrivers(body: any): Promise<({
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
    confirmBooking(body: {
        offer: any;
    }): Promise<{
        bookingId: string;
        driver: any;
    }>;
}
