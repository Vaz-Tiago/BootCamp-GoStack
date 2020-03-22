import { call, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../../services/api';
import { addToCartSuccess } from './actions';

function* addToCart({ id }) {
  // Método call do saga é responsávelpor chamar métodos que serão assincronos
  // Parametro que iria dentro do get da api vai como segundo parametro do call
  const response = yield call(api.get, `/products/${id}`);

  // Put dispara um action do redux
  yield put(addToCartSuccess(response.data));
}

// all() é um método do saga
export default all([
  // takeLatest é um listener, lastest porque ele só escuta a ultima action executada
  // Ou seja, se o usuário fr impaciente e sair clicando, cada clique anula o anterior
  // executando a ação apenas uma vez, caso ela ainda não tenha terminado

  // 1° parametro é qual ação ouvir
  // 2° qual função disparar
  takeLatest('@cart/ADD_REQUEST', addToCart),
]);
