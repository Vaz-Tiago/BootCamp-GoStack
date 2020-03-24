import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthLayout from '~/pages/_layouts/auth';
import DefaultLayout from '~/pages/_layouts/default';

// Component chama RouteWrapper mas poderia receber qualquer nome
// Desestruturação dos parametros que rece:
// component: Component (Com C maiusculo para que possa ser um componenet do React)
// isPrivate, PAra definir quais rotas são privadas
// ...rest contém o restante dos parametros que possam verticalAlign:
export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  // Verfica se está logado
  const signed = false;
  // Se não está logado e a rota é privada, retorna para o root
  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }
  // Se está logado e a rota não é privada Redireciona para o dashboard
  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />;
  }

  const Layout = signed ? DefaultLayout : AuthLayout;

  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};
