import Sequelize from 'sequelize';

// Importando os models da aplicação
import User from '../app/models/User';

import databaseConfig from '../config/database';

// Criando um array de models:
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Importa a conexão do arquivo de configuração
    this.connection = new Sequelize(databaseConfig);

    // Passando para cada um dos models a variavel de conexão
    models.map(model => model.init(this.connection));
  }
}

// Classe deve ser chamada no app para iniciar a conexao.
export default new Database();
