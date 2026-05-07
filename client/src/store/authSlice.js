import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const saved = JSON.parse(localStorage.getItem('luxecart_auth') || 'null');

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const toggleWishlist = createAsyncThunk('auth/wishlist', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/auth/wishlist/${productId}`);
    return data.wishlist;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Wishlist update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: saved?.user || null,
    token: saved?.token || null,
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('luxecart_auth');
      toast.success('Logged out');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (state.user) state.user.wishlist = action.payload;
        localStorage.setItem('luxecart_auth', JSON.stringify({ user: state.user, token: state.token }));
      })
      .addMatcher((action) => [login.pending.type, register.pending.type].includes(action.type), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => [login.fulfilled.type, register.fulfilled.type].includes(action.type), (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('luxecart_auth', JSON.stringify(action.payload));
        toast.success('Welcome to LuxeCart');
      })
      .addMatcher((action) => [login.rejected.type, register.rejected.type].includes(action.type), (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
