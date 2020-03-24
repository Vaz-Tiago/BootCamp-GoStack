import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, Content } from './styles';
/*
  <Wrapper>
    <Component>
      Esse e qualquer outro component vem como children do Wrapper
    </Component>
  </Wrapper>

*/

export default function AuthLayout({ children }) {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
