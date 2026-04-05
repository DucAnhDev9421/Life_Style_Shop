import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '../services/wishlistApi';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, thunkAPI) => {
  try {
    const response = await wishlistApi.getWishlist();
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, thunkAPI) => {
  try {
    const response = await wishlistApi.addToWishlist(productId);
    toast.success('Added to wishlist');
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, thunkAPI) => {
  try {
    const response = await wishlistApi.removeFromWishlist(productId);
    toast.success('Removed from wishlist');
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearWishlist: (state) => {
       state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
