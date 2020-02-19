import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    // Para cada job é necessário uma chave unica
    return 'CancellationMail';
  }

  // É a tarefa que será executada quando esse processo deenviar email ser executado
  // É uma fila que precisa enviar 10 emails e o handle será chamado cada vez que um
  // email for enviado

  // As variaveis com as informações do banco de dados chegarão via parametro do handle
  async handle({ data }) {
    const { appointment } = data;

    console.log('A fila rodou');

    await Mail.sendEmail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      // 3° parametro pode ser TEXT ou HTML
      // Passando as informações para o Template
      template: 'cancellation',
      // Context, leva as variaveis que o tempplete receberá
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia', dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
