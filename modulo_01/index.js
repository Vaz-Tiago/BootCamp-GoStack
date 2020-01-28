const express = require('express');


const server = express();


//Dizendo ao express que ele deve utilizar json
server.use(express.json());




const users = ['Tiago', 'Cibele', 'Jake'];

// ##### INICIO MIDDLEWARES #####



//Middleware Global
//Global pois sempre será executado antes de qualquer rota (Ótimo para logs)
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  //O next para que o middleware da rota seja executado.
  //Não necessáriamente precisa ser um return, após o next()
  next();

  console.timeEnd('Request')
});


//Middleware Local
//Verifica se o campo name está vazio ou não existe no body da requisição (POST / PUT)
function checkUserExist(req, res, next){
  if(req.body.name === '' || !req.body.name){
    //res.status retorna o código de status da requisição. No caso o 400 retorna BadRequest
    return res.status(400).json({ erro: 'User is required!'})
  }
  return next()
}


// Middleware Local
//Verificando se o usuário que foi passado via parametro existe
function checkUserInArray(req, res, next){
  //Alterandoa variavel req dentro do middleware
  const user = users[req.params.index]
  if(!user){
    return res.status(400).json({erro: 'User does not exist!'})
  }

  //Toda rota que utiliza esse middleware terá acesso a variável req.user
  req.user = user;

  return next();
}

// ##### FIM MIDDLEWARES #####



//Listagem de todos usuários
server.get('/users', (req, res) => {
  return res.json(users);
});



//Mostrar um usuário específico
server.get('/users/:index', checkUserInArray, (req, res)=> {
  //Utilizando a variavel criada no middleware
    //const { index } = req.params;
    //return res.json(`${users[index]}`);
  return res.json(req.user);
});



//Adicionar um usuário
server.post('/users', checkUserExist, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});



//Editar o usuário:
server.put('/users/:index', checkUserExist, checkUserInArray, (req, res)=> {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});


//Deletar usuário
server.delete('/users/:index', checkUserInArray, (req, res)=> {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send('');
});



server.listen(3000);