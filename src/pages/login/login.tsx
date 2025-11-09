import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { selectUserError, selectUserLoading } from '@slices';
import { loginUserThunk } from '@thunks';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const error = useAppSelector(selectUserError);
  const loading = useAppSelector(selectUserLoading);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUserThunk({ email, password }));

    if (loginUserThunk.fulfilled.match(resultAction)) {
      // если логин успешен — переход в профиль
      navigate('/profile');
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
