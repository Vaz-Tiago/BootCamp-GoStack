const express = require('express');


const server = express();


//Dizendo ao express que ele deve utilizar json
server.use(express.json());

//CRUD

const users = ['Tiago', 'Cibele', 'Jake'];

//Criando um Middleware Global
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  //O next para que o middleware da rota seja executado.
  //Não necessáriamente precisa ser um return, após o next()
  next();

  console.timeEnd('Request')
});

//Listagem de todos usuários
server.get('/users', (req, res) => {
  return res.json(users);
});

//Mostrar um usuário específico
server.get('/users/:index', (req, res)=> {
  const { index } = req.params;
  return res.json({message: `Hello ${users[index]}!!!`});
});

//Adicionar um usuário
server.post('/users', (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

//Editar o usuário:
server.put('/users/:index', (req, res)=> {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});


//Deletar usuário
server.delete('/users/:index', (req, res)=> {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send('');
});

server.listen(3000);