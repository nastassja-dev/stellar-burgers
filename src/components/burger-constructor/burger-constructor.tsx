import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { clearConstructor, selectConstructor } from '@slices';
import { createOrderThunk } from '@thunks';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  // Переменные из стора для constructorItems, orderRequest и orderModalData
  const { bun, ingredients } = useAppSelector(selectConstructor);
  const constructorItems = {
    bun,
    ingredients
  };
  // Запрос на оформление заказа и данные для модального окна из стора
  const orderRequest = useAppSelector((s) => s.orders.isLoading);
  const orderModalData = useAppSelector((s) => s.orders.currentOrder ?? null);

  // Вычисляем итоговую цену
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    // Оформление заказа
    dispatch(createOrderThunk(ingredients.map((item) => item._id ?? '')));
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={() => dispatch(clearConstructor())}
    />
  );
};
