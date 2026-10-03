import { BookingSchedule, AvailableDriver, RideInfoFromAI, Language, ChatMessage, ServiceLevel, RideRequest } from '@loadify/types';
export declare class LoadifyApiClient {
    private client;
    constructor(baseURL: string);
    setAuthToken(token: string): void;
    clearAuthToken(): void;
    login(mobile: string, password: string): Promise<any>;
    register(details: any): Promise<any>;
    parseRideRequestWithAI(prompt: string, language: Language): Promise<RideInfoFromAI>;
    findDrivers(vehicleId: string, schedule: BookingSchedule, serviceLevel: ServiceLevel, userId: string): Promise<AvailableDriver[]>;
    confirmBooking(offer: AvailableDriver): Promise<{
        bookingId: string;
        driver: AvailableDriver & {
            mobile: string;
        };
    }>;
    getDriverDashboard(driverId: string): Promise<{
        isOnline: boolean;
        requests: RideRequest[];
    }>;
    respondToRideRequest(requestId: number, response: 'accepted' | 'rejected' | 'offer_sent', newTime?: string): Promise<{
        success: boolean;
    }>;
    getChatHistory(chatId: string): Promise<ChatMessage[]>;
    sendMessage(chatId: string, senderId: string, text: string): Promise<ChatMessage>;
}
export declare const createApiClient: (baseURL: string) => LoadifyApiClient;
//# sourceMappingURL=index.d.ts.map