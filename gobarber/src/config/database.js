// Utilizado essa sintaxe pois o sequelize-cli não consegue entender export default

module.exports = {
  // Para utilizar precisa ir na documentação ver as dependencias de cada dialeto
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    // Coluna createdAt e updatedAt em cada tabela do meu bd
    timestamps: true,
    // CRegra de nomenclatura com underscore _
    underscored: true,
    underscoredAll: true,
  },
};
