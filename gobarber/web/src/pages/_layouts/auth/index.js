import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper } from './styles';
/*
  <Wrapper>
    <Component>
      Esse e qualquer outro component vem como children do Wrapper
    </Component>
  </Wrapper>

*/

export default function AuthLayout({ children }) {
  return <Wrapper>{children}</Wrapper>;
}

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
