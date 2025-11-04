import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    // указываем unknown, чтобы TS не ругался на .data
    const res = (await getIngredientsApi()) as
      | { data?: TIngredient[] }
      | TIngredient[];

    // если API возвращает объект с data — достаём её
    const ingredients = Array.isArray(res) ? res : res.data;

    if (!Array.isArray(ingredients)) {
      throw new Error('Ошибка при загрузке ингредиентов');
    }

    return ingredients;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});
