module.exports = {
  up: (queryInterface, Sequelize) => {
    // Query para modificação de tabela.
    // addColumn é a alteração
    // 1 parametro: tabela que será alterada;
    // 2 Parametro: nome da coluna que será adicionada
    // 3 Parametro: as informações da coluna:
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      // Criando chave estrangeira:
      // Só funciona se a tabela que será refenciada já existir, então não adianta criar o FK,
      // Já na primeira migration;
      references: { model: 'files', key: 'id' },
      // Ações que deverão ser realizadas na tabela files caso haja alteração na tabela users;
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    // Desfazendo alteração
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
