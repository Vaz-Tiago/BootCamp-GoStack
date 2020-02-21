import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
// Necessário SEMPRE importar o express-async-error antes de importar as rotas
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

// Iniciando o arquivo de conexao com o banco de dados
import './database';

class App {
  constructor() {
    this.server = express();

    // Iniciando o sentry
    if (process.env.NODE_ENV === 'development') {
      Sentry.init(sentryConfig);
    }
    this.middlewares();
    this.routes();

    // Lidando com o retorno do erro:
    this.exceptionHandler();
  }

  middlewares() {
    // Sentry - Necessário antes de todas as rotas
    if (process.env.NODE_ENV === 'development') {
      this.server.use(Sentry.Handlers.requestHandler());
    }

    this.server.use(express.json());

    // Serivdo uma rota para acesso de arquivos estaticos:
    // Utilizado para fornecer ao front o caminho da imagem do avatar do usuario
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // Sentry - Necessário depois de todas as rotas
    if (process.env.NODE_ENV === 'development') {
      this.server.use(Sentry.Handlers.errorHandler());
    }
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server;
