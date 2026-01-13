import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/notifications';

export const getNotifications = createAsyncThunk('notifications/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const markAsRead = createAsyncThunk('notifications/read', async (id, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const clearNotifications = createAsyncThunk('notifications/clear', async (_, thunkAPI) => {
  try {
    await axios.delete(API_URL);
    return [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetNotifications: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(clearNotifications.fulfilled, (state) => {
        state.notifications = [];
      });
  },
});

export const { resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
