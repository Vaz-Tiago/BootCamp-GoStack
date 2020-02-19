import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// Todos os jobs que deverão ser iniciados
const jobs = [CancellationMail];

class Queue {
  constructor() {
    // Aqui dentro ficam várias filas
    this.queues = {};

    this.init();
  }

  init() {
    // Desestruturação para acessar os métodos direto
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // Adiciona trabalhos dentro de cada fila:
  // 1° parametro: Qual fila quero adicionar o trabalho
  // 2° parametro: Dados do job em si; Tipo as variaveis de appointment etc
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();
