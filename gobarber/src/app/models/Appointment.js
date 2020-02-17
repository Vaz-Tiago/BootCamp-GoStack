import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // Método chamado automaticamente pelo loader de models. Dentro de database/index.js
  static associate(models) {
    // Pertence ao model usuário, pois foi um usuário quem fez o agendamento.
    // Dois relacionamentos na mesma tabela é necessário o alias, as:
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
