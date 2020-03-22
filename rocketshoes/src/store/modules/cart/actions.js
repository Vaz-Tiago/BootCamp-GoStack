export function addToCart(product) {
  return {
    type: '@cart/ADD',
    product,
  };
}

export function removerFromCart(id) {
  return { type: '@cart/REMOVE', id };
}
