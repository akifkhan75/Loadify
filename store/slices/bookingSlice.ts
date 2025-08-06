import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BookingStatus, ServiceLevel, BookingSchedule, AvailableDriver, RideInfoFromAI, Language } from '../../types/types.ts';
import { parseRideRequestWithAI, findDrivers, confirmBooking } from '../../services/api.ts';

interface BookingState {
    status: BookingStatus;
    pickup: string;
    dropoff: string;
    aiPrompt: string;
    selectedVehicleId: string | null;
    serviceLevel: ServiceLevel;
    schedule: BookingSchedule;
    availableDrivers: AvailableDriver[];
    selectedOffer: AvailableDriver | null;
    confirmedDriver: (AvailableDriver & { mobile: string }) | null;
    error: string | null;
    searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: BookingState = {
    status: BookingStatus.INPUT,
    pickup: '',
    dropoff: '',
    aiPrompt: '',
    selectedVehicleId: null,
    serviceLevel: ServiceLevel.MOVE_ONLY,
    schedule: { type: 'now' },
    availableDrivers: [],
    selectedOffer: null,
    confirmedDriver: null,
    error: null,
    searchStatus: 'idle',
};

export const fetchRideFromAI = createAsyncThunk('booking/fetchRideFromAI', async ({ prompt, language, userId }: { prompt: string; language: Language, userId: string }, { dispatch, rejectWithValue }) => {
    try {
        const rideInfo = await parseRideRequestWithAI(prompt, language);
        if(rideInfo.vehicleType !== 'Unknown'){
            dispatch(setRideDetailsFromAI(rideInfo));
            // The searchForDrivers thunk will be dispatched from the component after AI results are back.
            // This avoids a nested thunk call and keeps logic cleaner.
            return rideInfo; 
        } else {
             return rejectWithValue("Could not determine vehicle from AI request.");
        }
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to parse request.';
        return rejectWithValue(message);
    }
});

export const searchForDrivers = createAsyncThunk('booking/searchForDrivers', async ({ vehicleId, schedule, serviceLevel, userId }: { vehicleId: string; schedule: BookingSchedule; serviceLevel: ServiceLevel, userId: string }, { rejectWithValue }) => {
    try {
        const drivers = await findDrivers(vehicleId, schedule, serviceLevel, userId);
        return drivers;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to find drivers.';
        return rejectWithValue(message);
    }
});

export const confirmRideBooking = createAsyncThunk('booking/confirmRideBooking', async (offer: AvailableDriver, { rejectWithValue }) => {
    try {
        const { bookingId, driver } = await confirmBooking(offer);
        return { bookingId, driver };
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to confirm booking.';
        return rejectWithValue(message);
    }
});

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setPickup: (state, action: PayloadAction<string>) => { state.pickup = action.payload; },
        setDropoff: (state, action: PayloadAction<string>) => { state.dropoff = action.payload; },
        setAiPrompt: (state, action: PayloadAction<string>) => { state.aiPrompt = action.payload; },
        setSelectedVehicleId: (state, action: PayloadAction<string | null>) => { state.selectedVehicleId = action.payload; },
        setServiceLevel: (state, action: PayloadAction<ServiceLevel>) => { state.serviceLevel = action.payload; },
        setSchedule: (state, action: PayloadAction<BookingSchedule>) => { state.schedule = action.payload; },
        selectOffer: (state, action: PayloadAction<AvailableDriver | null>) => {
            state.selectedOffer = action.payload;
            state.status = action.payload ? BookingStatus.CONFIRMING_BOOKING : BookingStatus.SHOWING_DRIVERS;
        },
        resetBooking: (state) => {
            Object.assign(state, initialState);
        },
        setRideDetailsFromAI: (state, action: PayloadAction<RideInfoFromAI>) => {
            state.pickup = action.payload.pickup;
            state.dropoff = action.payload.dropoff;
            state.selectedVehicleId = action.payload.vehicleType;
        },
        goToDriverList: (state) => {
            state.status = BookingStatus.SHOWING_DRIVERS;
        }
    },
    extraReducers: (builder) => {
        builder
            // AI Search
            .addCase(fetchRideFromAI.pending, (state) => {
                state.status = BookingStatus.SEARCHING;
                state.searchStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchRideFromAI.fulfilled, (state, action) => {
                // The search itself is triggered separately now, so we just wait here.
                // The status remains SEARCHING until the searchForDrivers thunk completes.
            })
            .addCase(fetchRideFromAI.rejected, (state, action) => {
                state.status = BookingStatus.ERROR;
                state.searchStatus = 'failed';
                state.error = action.payload as string;
            })
             // Manual Search
            .addCase(searchForDrivers.pending, (state) => {
                state.status = BookingStatus.SEARCHING;
                state.searchStatus = 'loading';
                state.availableDrivers = [];
                state.confirmedDriver = null;
                state.selectedOffer = null;
                state.error = null;
            })
            .addCase(searchForDrivers.fulfilled, (state, action) => {
                state.availableDrivers = action.payload;
                state.status = action.payload.length > 0 ? BookingStatus.SHOWING_DRIVERS : BookingStatus.ERROR;
                state.searchStatus = 'succeeded';
                 if(action.payload.length === 0) {
                    state.error = "No drivers found for this request.";
                }
            })
            .addCase(searchForDrivers.rejected, (state, action) => {
                state.status = BookingStatus.ERROR;
                state.searchStatus = 'failed';
                state.error = action.payload as string;
            })
            // Confirm Booking
            .addCase(confirmRideBooking.pending, (state) => {
                // You can add a specific loading state for confirmation if needed
            })
            .addCase(confirmRideBooking.fulfilled, (state, action) => {
                state.confirmedDriver = action.payload.driver;
                state.status = BookingStatus.DRIVER_CONFIRMED;
            })
            .addCase(confirmRideBooking.rejected, (state, action) => {
                state.status = BookingStatus.SHOWING_DRIVERS;
                state.error = action.payload as string;
                // Maybe show an alert here in the component
            });
    }
});

export const {
    setPickup,
    setDropoff,
    setAiPrompt,
    setSelectedVehicleId,
    setServiceLevel,
    setSchedule,
    selectOffer,
    resetBooking,
    setRideDetailsFromAI,
    goToDriverList,
} = bookingSlice.actions;


export default bookingSlice.reducer;