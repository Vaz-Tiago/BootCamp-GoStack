import React from 'react';
import PropTypes from 'prop-types';

/* 
  propriedades passadas para o componente podem ser acessados pela props ou seres desestruturados
  dentro do parametro:
  function TechItem(props){
    props.tech
  }
*/

function TechItem({ tech, onDelete }) {
  return (
    <li>
      { tech }
      <button type='button' onClick={onDelete}>Delete</button>
    </li>
  )
}

/*
  Para propriedades que não foram passadas para o componente podemos utilizar o defaultProps, definindo assim um
  valor paadrao para um propriedade que é utilizada pelo componente mas que pode não ser passada para ele
*/

TechItem.defaultProps = {
  tech: 'Oculto',
};

TechItem.propTypes = {
  tech: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
}

export default TechItem;