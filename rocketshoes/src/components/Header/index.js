/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { MdShoppingBasket } from 'react-icons/md';

import { Container, Cart } from './styles';
import logo from '../../assets/images/logo.svg';

function Header({ cartSize }) {
  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu Carrinho</strong>
          <span>{cartSize} itens</span>
        </div>
        <MdShoppingBasket size={36} color="#fff" />
      </Cart>
    </Container>
  );
}

// Connect pode receber paramentros
// primeiro paramentro é uma função que recebe o state inteiro do redux
// Essa informação vem do rootReducer.
export default connect(state => ({
  // cart: é o objeto que estou criando
  // state.cart é o reducer que estou acessado
  cartSize: state.cart.length,
}))(Header);
