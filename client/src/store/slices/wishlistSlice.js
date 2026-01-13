import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/wishlist';

export const getWishlistItems = createAsyncThunk('wishlist/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (courseId, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, { courseId });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (itemId, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${itemId}`);
    return itemId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetWishlist: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlistItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlistItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
