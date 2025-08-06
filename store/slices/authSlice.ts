import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppView, Account, User, Driver } from '../../types/types.ts';
import { login, signup, updateAccount as apiUpdateAccount } from '../../services/api.ts';
import { RootState } from '../store.ts';

export const loginUser = createAsyncThunk('auth/login', async ({ mobile, password }: { mobile: string, password: string }, { rejectWithValue }) => {
    try {
        const account = await login(mobile, password);
        return account;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'An unknown error occurred';
        return rejectWithValue(message);
    }
});

export const signupUser = createAsyncThunk('auth/signup', async (details: any, { rejectWithValue }) => {
    try {
        const account = await signup(details);
        return account;
    } catch (error: any)
     {
        const message = error.response?.data?.message || error.message || 'An unknown error occurred';
        return rejectWithValue(message);
    }
});

export const updateAccountDetails = createAsyncThunk('auth/updateAccount', async ({ accountId, updates }: { accountId: string, updates: Partial<User | Driver> & { currentPassword?: string } }, { rejectWithValue }) => {
    try {
        const account = await apiUpdateAccount(accountId, updates);
        return account;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'An unknown error occurred';
        return rejectWithValue(message);
    }
});


interface AuthState {
    account: Account | null;
    view: AppView;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    account: null,
    view: AppView.AUTH,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.account = null;
            state.view = AppView.AUTH;
            state.status = 'idle';
            state.error = null;
        },
        setView: (state, action: PayloadAction<AppView>) => {
            state.view = action.payload;
        },
        clearAuthError: (state) => {
            state.error = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.account = action.payload;
                state.view = action.payload.type === 'user' ? AppView.USER_HOME : AppView.DRIVER_HOME;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Signup
            .addCase(signupUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.account = action.payload;
                state.view = action.payload.type === 'user' ? AppView.USER_HOME : AppView.DRIVER_HOME;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Update Account
            .addCase(updateAccountDetails.fulfilled, (state, action) => {
                state.account = action.payload;
            });
    },
});

export const { logout, setView, clearAuthError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
