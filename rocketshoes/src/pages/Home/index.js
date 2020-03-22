/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';

// Actions
import * as CartActions from '../../store/modules/cart/actions';

import api from '../../services/api';
import { formatPrice } from '../../utils/format';

import { ProductList } from './styles';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data });
  }

  handleAddProoduct = product => {
    // Dispatch é chamado sempre que houver uma action;
    // Ativa todos os reducers da aplicação
    const { addToCart } = this.props;
    addToCart(product);
  };

  render() {
    const { products } = this.state;
    return (
      <ProductList>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>

            <button
              type="button"
              onClick={() => this.handleAddProoduct(product)}
            >
              <div>
                <MdAddShoppingCart size={16} color="#fff" /> 3
              </div>
              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

// 1° param null porque é referente ao masStateToProps, e como ainda não tem é null
export default connect(null, mapDispatchToProps)(Home);
