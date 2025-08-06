import axios from 'axios';
import { Platform } from 'react-native';
import {
    Account,
    Driver,
    User,
    BookingSchedule,
    AvailableDriver,
    RideInfoFromAI,
    Language,
    ChatMessage,
    ServiceLevel,
    RideRequest,
} from '../types/types.ts';

// For Android emulator, 'localhost' points to the emulator itself.
// Use '10.0.2.2' to connect to the host machine's localhost.
// For iOS simulator, 'localhost' works as expected.
const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});


// --- Auth ---

export async function login(mobile: string, password: string): Promise<User | Driver> {
    const response = await apiClient.post('/auth/login', { mobile, password });
    return response.data;
}

export async function signup(details: any): Promise<Account> {
    // In a real app, you'd likely use FormData for file uploads,
    // but we'll send JSON for this example. The backend would handle it.
    const response = await apiClient.post('/auth/signup', details);
    return response.data;
}

export async function updateAccount(accountId: string, updates: Partial<User | Driver>): Promise<Account> {
    const response = await apiClient.put(`/accounts/${accountId}`, updates);
    return response.data;
}


// --- AI Service (Calling our own backend, which then calls Gemini) ---

export async function parseRideRequestWithAI(prompt: string, language: Language): Promise<RideInfoFromAI> {
    const response = await apiClient.post('/booking/ai-parse', { prompt, language });
    return response.data;
}

// --- User/Booking Flow ---

export async function findDrivers(vehicleId: string, schedule: BookingSchedule, serviceLevel: ServiceLevel, userId: string): Promise<AvailableDriver[]> {
    const response = await apiClient.post('/booking/find-drivers', { vehicleId, schedule, serviceLevel, userId });
    return response.data;
}

export async function confirmBooking(offer: AvailableDriver): Promise<{ bookingId: string, driver: AvailableDriver & { mobile: string } }> {
    const response = await apiClient.post('/booking/confirm', { offer });
    return response.data;
}

// --- Driver Flow ---

export async function getDriverDashboard(driverId: string): Promise<{ isOnline: boolean, requests: RideRequest[] }> {
    const response = await apiClient.get(`/driver/dashboard/${driverId}`);
    return response.data;
}

export async function respondToRideRequest(requestId: number, response: 'accepted' | 'rejected' | 'offer_sent', newTime?: string): Promise<{ success: boolean }> {
    const apiResponse = await apiClient.post(`/driver/requests/${requestId}/respond`, { response, newTime });
    return apiResponse.data;
}


// --- Chat Flow ---

export async function getChatHistory(chatId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get(`/chat/${chatId}`);
    return response.data;
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<ChatMessage> {
    const response = await apiClient.post(`/chat/${chatId}/message`, { senderId, text });
    return response.data;
}
