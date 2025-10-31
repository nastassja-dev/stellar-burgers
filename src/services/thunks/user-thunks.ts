import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

export const setIsAuthChecked = createAction<boolean>('user/setIsAuthChecked');

// Register
export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

// Login
export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

// Fetch (проверка авторизации)
export const fetchUserThunk = createAsyncThunk(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Fetch user failed');
    }
  }
);

// Profile update
export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (userPartialData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(userPartialData);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Update user failed');
    }
  }
);

// logout
export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Logout failed');
    }
  }
);
