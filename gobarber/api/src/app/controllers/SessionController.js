import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/authConfig';
import User from '../models/User';
import File from '../models/File';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    // Verificação se usuário existe
    const user = await User.findOne({
      where: { email },
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });

    if (!user) {
      // Status 401 é de unauthorized
      return res.status(401).json({ error: 'User not found' });
    }

    // Verificação se a senha está correta(feita na model user)
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Caso tudo ocorra bem retorna os dados:

    const { id, name, avatar, provider } = user;
    return res.json({
      // Variavel com as informações do usuário
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      // Variável com informações do token
      // 1° Parametro: Payload. Info usuário. Objeto
      // 2° Parametro: Chave Secreta unica entre todas aps do universo
      // 3° Parametro: Opções do token
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
