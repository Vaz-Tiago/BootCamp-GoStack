import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// Toda Model deve estender de Model
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // Apensa os campos que serão editados pelo usuário
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // Adciona um trecho de código sempre antes de salvar qualquer informação
    // de usuário dentro do banco de dados.

    // Primeiro parametro o momento em que será executado
    // Segundo parametro a função que será executada.
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    // Checa a informação que o usuário passou com a que está armazenada dentro do bd
    // Retorno booleano.
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
