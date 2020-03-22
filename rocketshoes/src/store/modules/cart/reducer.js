// Importando immer para facilitar a alteração de state

import produce from 'immer';

// Recebe por padrão uma variavel state e outra action
// State é o state anterior do reducer antes da action ser acionada
// action é a ação que foi acionada

export default function cart(state = [], action) {
  // Estrutura do reducer:
  // Como todos são ativados com uma ação é necessário um switch case para definir
  // quando ser executado. Default é para manter as coisas como estão caso não seja a action dele

  // Segundo item do array é um objeto, que recebe todos os dados do produto a acrescenta alguns a mais
  switch (action.type) {
    case '@cart/ADD':
      // Utilizando o immer
      // state é o stado atual
      // draft o rascunho que iremos fazer
      return produce(state, draft => {
        // Verificando se o produto já está na lista
        const productIndex = draft.findIndex(p => p.id === action.product.id);
        if (productIndex >= 0) {
          draft[productIndex].amount += 1;
        } else {
          draft.push({
            ...action.product,
            amount: 1,
          });
        }
      });
    case '@cart/REMOVE':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
    default:
      return state;
  }
}
