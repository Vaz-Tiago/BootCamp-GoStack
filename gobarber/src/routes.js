import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ Message: 'Seja Bem Vindo' });
});

// Parametro da rota é o método da classe UserController
routes.post('/users', UserController.store);

export default routes;
