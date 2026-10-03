import axios from 'axios';
export class LoadifyApiClient {
    client;
    constructor(baseURL) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    setAuthToken(token) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    clearAuthToken() {
        delete this.client.defaults.headers.common['Authorization'];
    }
    // Auth
    async login(mobile, password) {
        const res = await this.client.post('/v1/auth/login', { mobile, password });
        return res.data;
    }
    async register(details) {
        const res = await this.client.post('/v1/auth/register', details);
        return res.data;
    }
    // Booking
    async parseRideRequestWithAI(prompt, language) {
        const res = await this.client.post('/v1/booking/ai-parse', { prompt, language });
        return res.data;
    }
    async findDrivers(vehicleId, schedule, serviceLevel, userId) {
        const res = await this.client.post('/v1/booking/find-drivers', { vehicleId, schedule, serviceLevel, userId });
        return res.data;
    }
    async confirmBooking(offer) {
        const res = await this.client.post('/v1/booking/confirm', { offer });
        return res.data;
    }
    // Driver
    async getDriverDashboard(driverId) {
        const res = await this.client.get(`/v1/driver/dashboard/${driverId}`);
        return res.data;
    }
    async respondToRideRequest(requestId, response, newTime) {
        const res = await this.client.post(`/v1/driver/requests/${requestId}/respond`, { response, newTime });
        return res.data;
    }
    // Chat
    async getChatHistory(chatId) {
        const res = await this.client.get(`/v1/chat/${chatId}`);
        return res.data;
    }
    async sendMessage(chatId, senderId, text) {
        const res = await this.client.post(`/v1/chat/${chatId}/message`, { senderId, text });
        return res.data;
    }
}
export const createApiClient = (baseURL) => new LoadifyApiClient(baseURL);
