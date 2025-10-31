import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  //useDispatch as dispatchHook,
  //useSelector as selectorHook,
  useDispatch,
  useSelector
} from 'react-redux';

import { rootReducer } from './reducers';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Типы стора
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
