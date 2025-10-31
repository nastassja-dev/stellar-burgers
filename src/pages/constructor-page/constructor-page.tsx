import { useAppDispatch, useAppSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
  selectShowPreloader
} from '@slices';
import { fetchIngredients } from '@thunks';

export const ConstructorPage: FC = () => {
  // Переменная из стора
  const dispatch = useAppDispatch();

  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsLoading);
  const error = useAppSelector(selectIngredientsError);
  const showPreloader = useAppSelector(selectShowPreloader);

  useEffect(() => {
    // Запрашиваем ингредиенты только если их ещё нет
    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients]);

  if (isLoading && (!ingredients || ingredients.length === 0)) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium mt-10'>
        Ошибка загрузки ингредиентов: {error}
      </p>
    );
  }

  return (
    <>
      {showPreloader ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
