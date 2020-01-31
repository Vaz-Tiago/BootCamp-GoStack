import { Router } from 'express';

const routes = new Router();

// Correção eslint para deixar tudo em uma linha
routes.get('/', (req, res) => res.json({ message: 'Hello World' }));

export default routes;
