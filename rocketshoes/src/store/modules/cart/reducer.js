// Recebe por padrão uma variavel state e outra action
// State é o state anterior do reducer antes da action ser acionada
// action é a ação que foi acionada

export default function cart(state = [], action) {
  // Estrutura do reducer:
  // Como todos são ativados com uma ação é necessário um switch case para definir
  // quando ser executado. Default é para manter as coisas como estão caso não seja a action dele

  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.product];
    default:
      return state;
  }
}
