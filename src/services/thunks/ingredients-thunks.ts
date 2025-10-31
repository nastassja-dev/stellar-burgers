import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const res = await getIngredientsApi();
    if (!res || !Array.isArray(res)) {
      throw new Error('Ошибка при загрузке ингредиентов');
    }
    return res;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});
