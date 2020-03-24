// Biblioteca de validação de dados
import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';

class UserController {
  // Função de gravar dados:
  // Basicamanete a mesma estrutura de um middleware.
  async store(req, res) {
    // Regras de validação:
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Verificando validação:
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Informações vem do corpo da requisição
    // Verificação se email já está cadastrado:
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // define quais campos serão retornados para o frontend
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      // Senha só vai ser requirida se a senha antiga for informada
      password: Yup.string()
        .min(6)
        // Quando ('campo preenchido, funcao se estiver preenchido)
        //  campo field é ele mesmo
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        // Definindo igualdade dos campos
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = req.body;

    // Busca por primary key
    const user = await User.findByPk(req.userId);

    // Verificação para caso esteja trocando de email
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    // Verificando se a senha antiga é a mesma que está atualmente cadastrada
    // Condição só será testada se o usuário tiver digitado a senha antiga

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    // Caso todas as alternativas sejam satisfeitas, retorna para o frontend as informações:
    await user.update(req.body);

    const { id, name, avatar } = User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserController();
