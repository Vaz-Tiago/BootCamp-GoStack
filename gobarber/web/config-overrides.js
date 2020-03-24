// Esse arquivo é rescrito em node por isso a sintaxe é diferente
const { addBabelPlugin, override } = require('customize-cra');

// Exporta o plugin que deseja adicionar na instalação.
// Para adicionar um plugin babel:
// 1° Param: Array com o nome do plugin, e um objeto com suas configurações
module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      rootPathSuffix: 'src',
    },
  ])
);
