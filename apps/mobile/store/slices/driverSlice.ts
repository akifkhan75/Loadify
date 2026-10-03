import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RideRequest } from '../../types/types.ts';
import { getDriverDashboard, respondToRideRequest } from '../../services/api.ts';

interface DriverState {
    isOnline: boolean;
    requests: RideRequest[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DriverState = {
    isOnline: true, // Default to true, backend will provide the source of truth
    requests: [],
    status: 'idle',
    error: null,
};

export const fetchDashboard = createAsyncThunk('driver/fetchDashboard', async (driverId: string, { rejectWithValue }) => {
    try {
        const data = await getDriverDashboard(driverId);
        return data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch dashboard.';
        return rejectWithValue(message);
    }
});

export const respondToRequest = createAsyncThunk('driver/respondToRequest', async (params: { requestId: number, response: 'accepted' | 'rejected' | 'offer_sent', newTime?: string }, { rejectWithValue }) => {
    try {
        await respondToRideRequest(params.requestId, params.response, params.newTime);
        return { requestId: params.requestId, response: params.response };
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to respond to request.';
        return rejectWithValue(message);
    }
});

const driverSlice = createSlice({
    name: 'driver',
    initialState,
    reducers: {
        toggleOnlineStatus: (state) => {
            // This is now an optimistic update. A real implementation might involve another thunk
            // to persist this state on the backend.
            state.isOnline = !state.isOnline;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch dashboard
            .addCase(fetchDashboard.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.requests = action.payload.requests;
                state.isOnline = action.payload.isOnline;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Respond to request
            .addCase(respondToRequest.fulfilled, (state, action) => {
                // On success, simply remove the request from the list
                state.requests = state.requests.filter(req => req.id !== action.payload.requestId);
            })
            .addCase(respondToRequest.rejected, (state, action) => {
                // Log the error. A UI element could display this.
                state.error = action.payload as string;
                console.error("Failed to respond to request:", action.payload);
            });
    }
});

export const { toggleOnlineStatus } = driverSlice.actions;

export default driverSlice.reducer;