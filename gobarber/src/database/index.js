import Sequelize from 'sequelize';
import mongoose from 'mongoose';

// Importando os models da aplicação
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

// Criando um array de models:
const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
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

  // Iniciando ORM mongoose
  mongo() {
    // Passando string de conexão. Não foi criado usuario e senha.
    // Segundo parametro é um objeto de configurações
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

// Classe deve ser chamada no app para iniciar a conexao.
export default new Database();
