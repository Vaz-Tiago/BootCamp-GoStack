import { startOfDay, endOfDay, parseISO } from 'date-fns';
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
}

export default new ScheduleController();
