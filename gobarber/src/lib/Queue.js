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

      // EventListener on(''). Utilizado para ouvir os eventos ao processar
      // failed para ouvir eventos que falharam, etc..
      // Quando falhar ele vai chamar o método handleFailure
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
