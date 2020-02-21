# BootCamp GoStack

#### JavaScript - Node.Js | ReactJs | React Native


Repositório de Estudo

### API REST

**_Finalizada_**

#### Tecnologias Utilizadas:

- Express:
  Framework utilizado para construção da API

- Postgres:
  Banco de dados relacional para armazenar as informações de usuários(Clientes e Profissionais), agendamento de horário e arquivos

- Sequelize:
  Sequelize para lidar com a interação do app com o banco de dados relacional. Criação das migrations e models.

- Yup:
  Validação de dados;

- Multer:
  Upload de arquivos;

- MongoDB:
  Banco de dados não relacional utilizado para criar o sistema de notificações dentro do app.

- Mongoose:
  Módulo para interação do app com o mongoDB

- Redis:
  Banco de dados chave/valor utilizado para lidar com o sistema de filas em background;

- Bee-queue:
  Organizar a fila de background jobs;

- Bcryptjs:
  Criptografar senhas de usuários antes de persistir as informações no banco de dados; 

- Jsonwebtoken:
  Para garantir a segurança ao acessar a API

- Nodemailer:
  Envio de emails;

- Express-handlebars / Nodemailer-express-handlebars:
  Template Engine para facilitar a inserção de variáveis Node em arquivos HTML.
    Nesse caso, como é uma API REST, foi utilizado apenas para a composição do HTML utilizado no Email;

- Sentry:
  Tratamento de erro em ambiente de produção. Ao ocorrer um erro, envia por email, em tempo real, um relatório completo do erro.

**Desenvolvimento**

- Youch:
  Tratamento de erro em ambiente de desenvolvimento. Retorna um json com o erro para análise do dev.

- Eslint e Prettier:
  Utilizados em conjunto para manter a padronização do código.

- Nodemon:
  Ferramenta indispensável para desenvolvimento Node, que reseta o server a cada save.

- Sucrase:
  Atualiza a maneira com que o node realiza os import / export dentro da aplicação;



