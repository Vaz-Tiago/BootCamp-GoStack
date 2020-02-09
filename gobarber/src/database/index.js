import Sequelize from 'sequelize';

// Importando os models da aplicação
import User from '../app/models/User';
import File from '../app/models/File';

import databaseConfig from '../config/database';

// Criando um array de models:
const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Importa a conexão do arquivo de configuração
    this.connection = new Sequelize(databaseConfig);

    // Passando para cada um dos models a variavel de conexão
    models
      .map(model => model.init(this.connection))
      // Verificando se há relacionamento, se houver roda o método
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

// Classe deve ser chamada no app para iniciar a conexao.
export default new Database();
