// /Users/nastyakam/Downloads/dev/stellar-burgers/src/services/order-slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  fetchFeedThunk,
  fetchOrderByNumberThunk,
  fetchUserOrdersThunk,
  createOrderThunk
} from '../thunks/order-thunks';

type OrdersState = {
  feed: TOrder[];
  userOrders: TOrder[];
  currentOrder?: TOrder;
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
};

const initialState: OrdersState = {
  feed: [],
  userOrders: [],
  currentOrder: undefined,
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // feed
      .addCase(fetchFeedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedThunk.fulfilled, (state, action) => {
        console.log('orders fulfilled payload:', action.payload);
        state.isLoading = false;
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // order by number
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOrder = undefined;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // user orders
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // create order
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default ordersSlice.reducer;
