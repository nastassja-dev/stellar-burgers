import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

type FeedsPayload = { orders: TOrder[]; total: number; totalToday: number };

export const fetchFeedThunk = createAsyncThunk<
  FeedsPayload,
  void,
  { rejectValue: string }
>('orders/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (err: any) {
    console.error('fetchFeedThunk error:', err);
    return rejectWithValue(err.message || 'Ошибка загрузки ленты заказов');
  }
});

export const fetchOrderByNumberThunk = createAsyncThunk<
  TOrder | undefined,
  number,
  { rejectValue: string }
>('orders/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number); // { orders: TOrder[] }
    return data.orders[0];
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Не удалось получить заказ');
  }
});

export const fetchUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi(); // TOrder[]
  } catch (err: any) {
    return rejectWithValue(
      err.message ?? 'Не удалось получить заказы пользователя'
    );
  }
});

export const createOrderThunk = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>(
  'orders/createOrder',
  async (ingredientsIds, { dispatch, rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientsIds); // { order, name }
      // после успеха обновить список заказов пользователя
      queueMicrotask(() => dispatch(fetchUserOrdersThunk()));
      return data.order;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Не удалось создать заказ');
    }
  }
);
