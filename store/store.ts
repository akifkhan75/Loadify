import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import bookingReducer from './slices/bookingSlice.ts';
import driverReducer from './slices/driverSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    driver: driverReducer,
  },
   // Middleware is configured by default, which is good for most cases.
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
