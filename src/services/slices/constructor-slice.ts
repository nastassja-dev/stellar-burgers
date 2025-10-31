// src/services/constructor-slice.ts
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../../services/store';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  // orderRequest и orderModalData будут добавлены на следующем шаге
  // orderRequest: boolean;
  // orderModalData: any | null;
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        console.log('ADDED TO CONSTRUCTOR SLICE:', action.payload);
        if (action.payload.type === 'bun') {
          // заменяем текущую булку
          state.bun = action.payload;
        } else {
          // добавляем обычный ингредиент
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        // автоматически добавляем уникальный uid
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },

    // Удалить ингредиент по id
    removeIngredient(state, action: PayloadAction<{ id: string }>) {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload.id
      );
    },

    // Переместить ингредиент в списке (drag & drop by indices)
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      ) {
        return;
      }
      const [moved] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, moved);
    },

    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const selectConstructor = (
  state: RootState
): {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
} => state.constructorBurger;

export default constructorSlice.reducer;
