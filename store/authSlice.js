// store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../utils/api';

// Helper function to safely access localStorage
const isClient = typeof window !== 'undefined';
const getToken = () => isClient ? localStorage.getItem('token') : null;
const setToken = (token) => {
  if (isClient) localStorage.setItem('token', token);
};
const removeToken = () => {
  if (isClient) localStorage.removeItem('token');
};

// Initialize state with token from localStorage if available
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: isClient && !!localStorage.getItem('token'),
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      localStorage.setItem('token', response.data.token);
      
      // Kullanıcı verilerini de kaydet
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      localStorage.setItem('token', response.data.token);
      
      // Kullanıcı verilerini de kaydet
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);

// Add a new function to check auth state on page load
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return null;
      
      // You need an API endpoint to verify token and get user data
      // For now, we'll just set isAuthenticated to true if token exists
      return { isAuthenticated: true };
    } catch (error) {
      removeToken();
      return rejectWithValue('Authentication failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Add case for checkAuth
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;