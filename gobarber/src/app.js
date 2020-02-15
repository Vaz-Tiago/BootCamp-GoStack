import express from 'express';
import path from 'path';
import routes from './routes';

// Iniciando o arquivo de conexao com o banco de dados
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
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
  }
}

export default new App().server;
