import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateUserThunk,
  fetchUserThunk,
  setIsAuthChecked
} from '../thunks/user-thunks';

// State
export interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

// State initial
export const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

// Slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // ручная установка user (например, после refresh)
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // флаг проверки авторизации
      .addCase(setIsAuthChecked, (state, action) => {
        state.isAuthChecked = action.payload;
      })

      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch (проверка авторизации)
      .addCase(fetchUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(fetchUserThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
      })

      // Profile update
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && 'user' in payload) {
          state.user = payload.user;
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.loading,
    selectUserError: (state) => state.error
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectUserLoading,
  selectUserError
} = userSlice.selectors;
export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
export default userSlice.reducer;
