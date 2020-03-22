import { startOfDay, endOfDay, parseISO, getHours, getMinutes } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res.status(401).json({
        error: 'User is not a provider',
      });
    }

    // query date - Pega apenas o dia e lista todos os agendamentos;
    const { date } = req.query;

    // Para filtrar a agenda do dia, vai ser utilizado um between entre a primeira
    // ultima hora do dia.

    // 2020-04-15 00:00:00
    // 2020-04-15 23:59:59

    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          // Operador do Sequelize. É uma variavel, por isso entre []
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }

  async teste(req, res) {
    const x = parseISO(req.body.x);
    const y = parseISO(req.body.y);
    const start = `${getHours(x).toString()}:${getMinutes(x).toString()}`;
    const end = `${getHours(y).toString()}:${getMinutes(y).toString()}`;

    const horarios = [
      '8:0',
      '8:30',
      '9:0',
      '9:30',
      '10:0',
      '10:30',
      '11:0',
      '11:30',
      '12:0',
      '12:30',
      '13:0',
    ];

    const indexStart = horarios.indexOf(start);
    const indexEnd = horarios.indexOf(end);

    let qtd = 0;
    for (let i = indexStart; i <= indexEnd; i += 1) {
      qtd += 1;
    }

    const teste = {
      tempo: horarios.splice(indexStart, qtd),
      size: qtd,
      pInicio: indexStart,
      pFinal: indexEnd,
    };

    return res.json({ teste });
  }
}

export default new ScheduleController();
