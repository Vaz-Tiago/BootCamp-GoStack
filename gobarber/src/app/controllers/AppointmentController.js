import * as Yup from 'yup';

// date-fns é uma biblioteca que lida com datas no Node.
import { startOfHour, isBefore, parseISO } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validate fails' });
    }

    const providerId = req.body.provider_id;
    const { date } = req.body;

    // Verifica se o provider_id é realemente de um provider
    const isProvider = await User.findOne({
      where: { id: providerId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // Define uma hora quebrada como hora inteira
    const hourStart = startOfHour(parseISO(date));

    // Verificando datas no passado
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    // Checar viabilidade da agenda do provider

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id: providerId,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    // Cria o agendamento
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id: providerId,

      // Define como hora inteira.
      date: hourStart,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
