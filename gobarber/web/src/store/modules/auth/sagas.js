import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
import history from '~/services/history';
import { signInSuccess } from './actions';

export function* signIn({ payload }) {
  const { email, password } = payload;

  // Método que retorna uma promisse é chamado pelo call
  const response = yield call(api.post, 'sessions', {
    email,
    password,
  });

  console.tron.log(response.data);

  const { token, user } = response.data;

  if (!user.provider) {
    console.tron.error('Usuário não é provider');
    return;
  }

  yield put(signInSuccess(token, user));

  history.push('/dashboard');
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
