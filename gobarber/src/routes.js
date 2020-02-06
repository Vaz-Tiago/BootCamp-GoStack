import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// middleware que recebe as configurações de upload
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  return res.json({ Message: 'Seja Bem Vindo' });
});

// Parametro da rota é o método da classe
routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Rota de upload de arquivo:
// upload.single pois vai ser enviado apenas um arquivo por vez
// Parametro é o nome do campo que vai ser utilizado na requisição
routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

export default routes;
