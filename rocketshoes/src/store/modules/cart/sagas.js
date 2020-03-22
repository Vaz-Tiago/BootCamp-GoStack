import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../utils/format';
import { addToCartSuccess, updateAmountSuccess } from './actions';

function* addToCart({ id }) {
  // select é utilizado para acessar o state do redux
  // Sempre que for utilizado um effect do saga é necessário um yield antes
  const productExists = yield select(state =>
    state.cart.find(p => p.id === id)
  );

  // Busca os dados de estoque na api
  const stock = yield call(api.get, `/stock/${id}`);

  // guarda a quantidade em estoque
  const stockAmount = stock.data.amount;

  // Verifica a quantidade atual do carrinho;
  const currentAmount = productExists ? productExists.amount : 0;

  // Adiciona 1 item
  const amount = currentAmount + 1;

  // Fazendo a verificação se a quantidade que vou add no carrinho e maior do que a quantidade que tenho em estoque
  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque');
    return;
  }

  if (productExists) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    // Método call do saga é responsávelpor chamar métodos que serão assincronos
    // Parametro que iria dentro do get da api vai como segundo parametro do call
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    // Put dispara um action do redux
    yield put(addToCartSuccess(data));
    history.push('/cart');
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;
  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast.error('Qauntidade solicitada fora de estoque');
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

// all() é um método do saga
export default all([
  // takeLatest é um listener, lastest porque ele só escuta a ultima action executada
  // Ou seja, se o usuário fr impaciente e sair clicando, cada clique anula o anterior
  // executando a ação apenas uma vez, caso ela ainda não tenha terminado

  // 1° parametro é qual ação ouvir
  // 2° qual função disparar
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
