export type Language = 'en' | 'ar' | 'ur';
export type Gender = 'male' | 'female' | 'other';

export enum AppView {
    AUTH,
    SIGNUP,
    USER_HOME,
    USER_PROFILE,
    DRIVER_HOME
}

export enum BookingStatus {
    IDLE,
    INPUT, // User is inputting trip details
    SEARCHING, // Searching for available drivers
    SHOWING_DRIVERS, // A list of available drivers/offers is being shown
    CONFIRMING_BOOKING, // User has selected a driver/offer and is on the final confirmation screen
    DRIVER_CONFIRMED, // User has confirmed the booking
    EN_ROUTE_PICKUP, // Driver is on the way to the pickup location
    TRIP_IN_PROGRESS, // The trip is currently in progress
    COMPLETED, // The trip has been successfully completed
    ERROR, // An error occurred during the booking process
}

export enum ServiceLevel {
    MOVE_ONLY = 'move_only',
    MOVE_LOAD = 'move_load',
    MOVE_PACK_LOAD = 'move_pack_load',
}

export enum DocumentStatus {
    NOT_UPLOADED = 'doc_not_uploaded',
    PENDING = 'doc_pending',
    APPROVED = 'doc_approved',
    REJECTED = 'doc_rejected',
}

export interface Document {
    nameKey: string;
    status: DocumentStatus;
    file?: any;
}

export interface BookingSchedule {
    type: 'now' | 'scheduled';
    dateTime?: string;
}

export interface BookingDetails {
    vehicleId: string | null;
    distance: number;
}

export interface Account {
    id: string;
    mobile: string;
    name: string;
    password?: string;
    type: 'user' | 'driver';
}

export interface User extends Account {
    type: 'user';
    gender: Gender | null;
    country: string;
    city: string;
    address: string;
    addresses: {
        home?: string;
        work?: string;
    };
}

export interface UserBooking {
    id: string;
    date: string;
    pickup: string;
    dropoff: string;
    fare: number;
    driver: {
        name: string;
        vehicle: string;
    };
    status: 'Completed' | 'Cancelled';
}

// --- DRIVER-SPECIFIC TYPES ---
export type DriverTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface CustomerReview {
    customerName: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export interface LoadingTeam {
    hasTeam: boolean;
    teamSize: number; // e.g., 2 persons
}

export interface VehicleProfile {
    pictures: string[]; // URLs to images
    sizeId: string; // Corresponds to a Vehicle ID like 'mini-truck'
    registrationNumber: string;
    color: string;
    make: string;
    model: string;
}

export interface DriverProfileData {
    gender: Gender | null;
    country: string;
    city: string;
    vehicleProfile: VehicleProfile;
    workingHours: string; // e.g., "Mon-Sat, 9 AM - 7 PM"
    addresses: {
        home: string;
        work: string;
    };
    documents: {
        cnic: Document;
        license: Document;
        vehicleDocs: Document;
    };
    loadingTeam: LoadingTeam;
}
// --- END DRIVER-SPECIFIC TYPES ---


export interface Driver extends Account {
    type: 'driver';
    photoUrl: string;
    rating: number;
    tier: DriverTier;
    reviews: CustomerReview[];
    profile: DriverProfileData;
}

export interface Vehicle {
  id: string;
  nameKey: string;
  descriptionKey: string;
  capacity: string;
  imageUrl: string;
  icon: { name: string; type: 'feather' | 'material' | 'ionicons' | 'ant'; };
  baseFare: number;
  perKmRate: number;
  seats: number;
}

export interface AvailableDriver {
    id: string; // driver's account id
    name: string;
    photoUrl: string;
    rating: number;
    vehicleName: string;
    licensePlate: string;
    distanceAway: number; // in km
    eta: number; // in mins
    fare: number; // The driver's bid for the ride
    chatId: string; // New field for chat
    loadingTeam: LoadingTeam; // new field for team info
    offer?: {
        newDateTime: string;
    }
}

export interface RideInfoFromAI {
    pickup: string;
    dropoff: string;
    vehicleType: 'mini-truck' | 'pickup' | 'large-truck' | 'Unknown';
}

export interface RideRequest {
    id: number;
    from: string;
    to: string;
    fare: number;
    vehicle: string;
    schedule: string;
    userId: string;
    userName: string;
    userMobile: string;
    chatId: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}
