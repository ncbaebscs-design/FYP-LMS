import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/cart';

export const getCartItems = createAsyncThunk('cart/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const addToCart = createAsyncThunk('cart/add', async (courseId, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, { courseId });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${itemId}`);
    return itemId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, thunkAPI) => {
  try {
    await axios.delete(API_URL);
    return [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetCart: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
