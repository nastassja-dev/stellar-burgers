import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  clearConstructor,
  clearOrder,
  selectConstructor,
  selectUser
} from '@slices';
import { createOrderThunk } from '@thunks';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  // Переменные из стора для constructorItems, orderRequest и orderModalData
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(selectUser); // новый селектор
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
    // если пользователь не авторизован — редиректим на логин
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    // если авторизован — оформляем заказ
    const ingredientIds = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    dispatch(createOrderThunk(ingredientIds));
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={() => {
        dispatch(clearOrder());
      }}
    />
  );
};
