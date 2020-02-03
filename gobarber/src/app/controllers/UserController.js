import User from '../models/User';

class UserController {
  // Função de gravar dados:
  // Basicamanete a mesma estrutura de um middleware.
  async store(req, res) {
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
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
