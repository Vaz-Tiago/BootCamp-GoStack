import jwt from 'jsonwebtoken';

// Promisify da biblioteca util que vem junto com o node.
// Cahamado pois o metodo verify do jwt utiliza os método de callback
import { promisify } from 'util';

// Necessário pois guarda a chave para verificação de autenticidade
import authConfig from '../../config/authConfig';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Desestruturando um array para descartar a primeira posição
  // pois o authHeader retorna um string: 'Bearer token'

  const [, token] = authHeader.split(' ');

  // Try catch para checagem
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Passado o id do usuário que foi recuperado do token via req. Para que possa ser
    // Acessado em qualquer rota que necessite de autenticação.
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
