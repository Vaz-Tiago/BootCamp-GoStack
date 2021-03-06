import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

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
routes.post('/files', upload.single('file'), FileController.store);

// Lista os profissionais
routes.get('/providers', ProviderController.index);
// Lista horários disponiveis de um profissional na data informada
routes.get('/providers/:providerId/available', AvailableController.index);

// Faz o agendaento
routes.post('/appointments', AppointmentController.store);
// Lista os agendamentos
routes.get('/appointments', AppointmentController.index);
// Deletar agendamento
routes.delete('/appointments/:id', AppointmentController.delete);

// Rota com a agenda do profissional
routes.get('/schedule', ScheduleController.index);

// Rota para notificações
routes.get('/notifications', NotificationController.index);
// Rota para atualizar Notificação como lida
routes.put('/notifications/:id', NotificationController.update);

export default routes;
