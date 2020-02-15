import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    // Fazendo um WHERE com JOIN na tabela user;
    const providers = await User.findAll({
      // Condição
      where: { provider: true },
      // Campos que serão retornados
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // Relacionamento(Com Alias informado na model)
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
