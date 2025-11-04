import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { fetchIngredients, fetchUserThunk, setIsAuthChecked } from '@thunks';
import {
  selectIngredientsError,
  selectIsAuthChecked,
  selectShowPreloader
} from '@slices';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute, UnAuthRoute } from '../protected-route/index';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

const App = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // backgroundLocation используется для модалок
  const background = location.state?.background;

  // root-aware селекторы из store
  const showPreloader = useAppSelector(selectShowPreloader);
  const error = useAppSelector(selectIngredientsError);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  // Проверяем авторизацию при старте приложения
  useEffect(() => {
    const initAuth = async () => {
      const hasRefresh = localStorage.getItem('refreshToken');

      if (hasRefresh) {
        try {
          await dispatch(fetchUserThunk());
        } catch (err) {
          console.error('Auth check failed', err);
        }
      }

      dispatch(setIsAuthChecked(true));
    };
    initAuth();
  }, [dispatch]);

  // Загружаем ингредиенты при первом рендере
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Закрытие модалки — возврат к предыдущему местоположению
  const handleCloseModal = () => {
    navigate(background?.pathname || '/');
  };

  // Пока авторизация не проверена — показываем прелоадер
  if (!isAuthChecked || showPreloader) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <p className='text text_type_main-medium mt-10'>
          Ошибка загрузки ингредиентов: {error}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Неавторизованные пользователи */}
        <Route
          path='/login'
          element={
            <UnAuthRoute>
              <Login />
            </UnAuthRoute>
          }
        />
        <Route
          path='/register'
          element={
            <UnAuthRoute>
              <Register />
            </UnAuthRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <UnAuthRoute>
              <ForgotPassword />
            </UnAuthRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <UnAuthRoute>
              <ResetPassword />
            </UnAuthRoute>
          }
        />

        {/* Авторизованные пользователи */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Страницы без модалок (если открыты напрямую) */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалки — если есть background */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ингредиенты' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
