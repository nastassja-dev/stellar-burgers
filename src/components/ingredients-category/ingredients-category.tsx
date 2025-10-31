import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectConstructor } from '@slices';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef }, ref) => {
  // Переменная из стора для burgerConstructor
  const { bun, ingredients } = useAppSelector(selectConstructor);
  const counters = useMemo(() => {
    const count: Record<string, number> = {};
    ingredients.forEach((i) => (count[i._id] = (count[i._id] || 0) + 1));
    if (bun) count[bun._id] = 2;
    return count;
  }, [bun, ingredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={bun ? [bun, ...ingredients] : ingredients}
      ingredientsCounters={counters}
      ref={ref}
    />
  );
});
