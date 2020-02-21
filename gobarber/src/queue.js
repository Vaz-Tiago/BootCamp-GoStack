import 'dotenv/config';

import Queue from './lib/Queue';

Queue.processQueue();

// Esse arquivo é criado na raiz da aplicação apenas para chamar o processo, porque
// dessa maneira ele não influencia na performance da aplicação, ou seja, enquanto
// pois roda em outro core do processador ou outro servidor
