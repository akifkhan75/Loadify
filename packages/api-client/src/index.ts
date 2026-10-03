import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Account, User, Driver, BookingSchedule, AvailableDriver, RideInfoFromAI, Language, ChatMessage, ServiceLevel, RideRequest } from '@loadify/types';

export class LoadifyApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Auth
  async login(mobile: string, password: string):Promise<any> {
    const res = await this.client.post('/v1/auth/login', { mobile, password });
    return res.data;
  }

  async register(details: any): Promise<any> {
    const res = await this.client.post('/v1/auth/register', details);
    return res.data;
  }

  // Booking
  async parseRideRequestWithAI(prompt: string, language: Language): Promise<RideInfoFromAI> {
    const res = await this.client.post('/v1/booking/ai-parse', { prompt, language });
    return res.data;
  }

  async findDrivers(vehicleId: string, schedule: BookingSchedule, serviceLevel: ServiceLevel, userId: string): Promise<AvailableDriver[]> {
    const res = await this.client.post('/v1/booking/find-drivers', { vehicleId, schedule, serviceLevel, userId });
    return res.data;
  }

  async confirmBooking(offer: AvailableDriver): Promise<{ bookingId: string, driver: AvailableDriver & { mobile: string } }> {
    const res = await this.client.post('/v1/booking/confirm', { offer });
    return res.data;
  }

  // Driver
  async getDriverDashboard(driverId: string): Promise<{ isOnline: boolean, requests: RideRequest[] }> {
    const res = await this.client.get(`/v1/driver/dashboard/${driverId}`);
    return res.data;
  }

  async respondToRideRequest(requestId: number, response: 'accepted' | 'rejected' | 'offer_sent', newTime?: string): Promise<{ success: boolean }> {
    const res = await this.client.post(`/v1/driver/requests/${requestId}/respond`, { response, newTime });
    return res.data;
  }

  // Chat
  async getChatHistory(chatId: string): Promise<ChatMessage[]> {
    const res = await this.client.get(`/v1/chat/${chatId}`);
    return res.data;
  }

  async sendMessage(chatId: string, senderId: string, text: string): Promise<ChatMessage> {
    const res = await this.client.post(`/v1/chat/${chatId}/message`, { senderId, text });
    return res.data;
  }
}

export const createApiClient = (baseURL: string) => new LoadifyApiClient(baseURL);
