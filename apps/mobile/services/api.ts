import { Platform } from 'react-native';
import { createApiClient } from '@loadify/api-client';

const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';
const client = createApiClient(baseURL);

export const login = client.login.bind(client);
export const signup = client.register.bind(client);
export const updateAccount = async (accountId: string, updates: any) => { /* TODO if needed */ };
export const parseRideRequestWithAI = client.parseRideRequestWithAI.bind(client);
export const findDrivers = client.findDrivers.bind(client);
export const confirmBooking = client.confirmBooking.bind(client);
export const getDriverDashboard = client.getDriverDashboard.bind(client);
export const respondToRideRequest = client.respondToRideRequest.bind(client);
export const getChatHistory = client.getChatHistory.bind(client);
export const sendMessage = client.sendMessage.bind(client);

