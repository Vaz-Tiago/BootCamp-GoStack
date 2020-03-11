import React, { Component } from 'react';

import TechItem from './TechItem';

class TechList extends Component{
  /* 
    defaultProps para componente statefull ou de classe:
     static defaultProps = {
       techs: 'oculto'
     }
  */
  state = {
    newTech: '',
    techs: []
  };

  // Executado assim que o componente aparece em tela
  componentDidMount(){
    const techs = localStorage.getItem('techs');
    if(techs) {
      this.setState({ techs: JSON.parse(techs)})
    }
  }

  // Executado sempre que houver alteração nas props ou estado do componente
  // Recebe como parametro as props e estado antigos. Faz a comparação dentro dele
  // componentDidUpdate(prevProps, prevState)
  // quando não utiliza um deles coloca-se o _ 
  componentDidUpdate(_, prevState) {
    // this.props, this.state
    if(prevState.techs !== this.state.techs) {
      // localStorage não aceita objetos
      localStorage.setItem('techs', JSON.stringify(this.state.techs))
    }
  }

  // Executado quando o componente deixa de existir
  // componentWillUnmount(){
  //   volta a um estado anterior, pois se o componente dispara, por exemplo, um listener,
  //   esse listenaer não deixa de existir com ele. Então o willUnmount serve para limpar o lixo
  // }



  // sempre arrow function para conseguir acessar o this
  handleInputChange = e => {
    this.setState({ newTech: e.target.value});
  }

  handleSubmit = e => {
    e.preventDefault();

    // Conceito de imutabilidade. States não podem ser alterados, portanto faz-se uma cópia do conteudo
    // antes de sobrescreve-lo e adiciona o valor que será acrescentado, retirado ou alterado no final

    this.setState({ 
      techs: [...this.state.techs, this.state.newTech],
      newTech: ''
    });
  }

  handleDelete = (tech) => {
    this.setState({ techs: this.state.techs.filter(t => t !== tech)})
  }

  render (){
    return (
      <form onSubmit={this.handleSubmit}>
      <ul>
        {/* 
          Tudo que se relaciona com o state deve ficar do lado do state
          e ser passado como parametro para o componente
        */}
        {this.state.techs.map(tech => (
          <TechItem 
            key={tech} 
            tech={tech} 
            onDelete={()=> this.handleDelete(tech)} 
          />
        ))}
      </ul>
      <input
        type='text' 
        onChange={this.handleInputChange} 
        value={this.state.newTech}
      /><br />
      <button type='submit'>Enviar</button>
      </form>
    )
  };
}

export default TechList