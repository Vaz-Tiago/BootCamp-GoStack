import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    // A data que o frontend retorna é feita atraves de um dataPicker do navegador
    // Por isso ela vem no formato Unix TimeStamp. Isso é importante principalmente
    // para testes no insomnia ao colocar a data na query.
    // new Date().getTime()

    const { date } = req.query;
    if (!date) {
      return req.status(400).json({ error: 'Invalid Date' });
    }

    // Convertendo a data para um numero inteiro
    const searchDate = Number(date);

    // Busca da agenda pela data:
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    // Horário de trabalho do provider:
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    // Verificação de disponibilidade;
    // Converter a data que chega em string para verificar igualdade com o array
    // 1° Se horário já passou;
    // 2° Se horário não tem nada marcado
    const available = schedule.map(time => {
      // Faz a divisão dos valores colocando cada um em uma variavel.
      // O que vem antes do : é hora e depois é minuto
      const [hour, minute] = time.split(':');

      // Convertendo a variavel searchDate em horas inteiras
      // setSeconds: 1° parametro uma hora qualquer, 2° param, valor desejado
      // setMinutes: 1° parametro uma hora qualquer, 2° param, valor desejado
      // setHouss: 1° parametro uma hora qualquer, 2° param, valor desejado
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      // Retorno é um objeto, e como o value é um array, vai ser um array de objetos;
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) && // Define false para horários anteriores a hora atual
          !appointments.find(a => format(a.date, 'HH:mm') === time), // Verifica se há agendamentos no banco de dados
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
