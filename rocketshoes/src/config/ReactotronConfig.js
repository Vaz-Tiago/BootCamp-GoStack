import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';

// Verifica se o usuário está em ambiente de desenvolvimento
// Só funciona em yarn start

if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure()
    .use(reactotronRedux())
    .connect();

  tron.clear();

  console.tron = tron;
}
