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
}

export default new UserController();
