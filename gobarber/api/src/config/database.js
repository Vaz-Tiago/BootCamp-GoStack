// Utilizado essa sintaxe pois o sequelize-cli não consegue entender export default
require('dotenv').config();

module.exports = {
  // Para utilizar precisa ir na documentação ver as dependencias de cada dialeto
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    // Coluna createdAt e updatedAt em cada tabela do meu bd
    timestamps: true,
    // CRegra de nomenclatura com underscore _
    underscored: true,
    underscoredAll: true,
  },
};
