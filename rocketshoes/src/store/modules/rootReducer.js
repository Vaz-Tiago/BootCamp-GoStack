import { combineReducers } from 'redux';

import cart from './cart/reducer';

// conforme for necessários, mais reducers podem ser importados e acrescentados aqui
export default combineReducers({
  cart,
});
