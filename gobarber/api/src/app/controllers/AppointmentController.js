import * as Yup from 'yup';

// date-fns é uma biblioteca que lida com datas no Node.
import { startOfHour, isBefore, parseISO, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import CancellationEmail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    // Paginação: Definindo a página atual. Caso não esteja definida é igual a 1
    // Passada via query(url: site.com.br/rota?page=1
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      // Apenas os agendamentos do usuario logado
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      // Ordena por data
      order: ['date'],
      // Attributes são as colunas da tabela que serão exibidas
      attributes: ['id', 'date', 'past', 'cancelable'],

      // Limitação de registros por págia:
      limit: 20,
      // Offset é a quantidade de registros que devem ser pulados na busca:
      // Essa conta é bem simples, pega variavel page, subtrai 1 e multiplica pela
      // quantidade de registros que devem ser exibidos por página;
      offset: (page - 1) * 20,
      // Incluí os dados do profissional que foi agendado
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

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

    // Impede de agendar consigo mesmo
    if (req.userId === providerId) {
      return res
        .status(400)
        .json({ error: 'You cant make a appointment with yourself' });
    }

    // Cria o agendamento
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id: providerId,

      // Define como hora inteira.
      date: hourStart,
    });

    // Notifica o prestador de serviço que um novo agendamento foi feito
    // Recuperando o nome do usuario que fez o agendamento
    const user = await User.findByPk(req.userId);

    // Adicionando uma formatação de data com date-fns
    const formatDate = format(hourStart, "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia ${formatDate} `,
      user: providerId,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    // Além da PK, vai incluir na busca as informações do provider:
    // Essa informação adicional será utilizada para enviar um email para o provider
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // verificando se o usuario que está cancelando é o mesmo que agendou
    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You dont have permission to cancel this appoitment' });
    }

    // Verificação do horário limite para cancelamento. Duas horas de antecedencia:

    // subHours do date-fns.
    // 1° parametro: data que tera suas horas subtraidas
    // 2° parametro: quantidade de horas a subtrair
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advanced',
      });
    }

    // Seta data atual para o campo canceled
    appointment.canceled_at = new Date();

    // Salva o registro
    await appointment.save();

    // Adicionando tarefa na lista de background jobs EMAIL
    // 1° Parametro KEY
    // 2° Parametro: Os dados que irão ser utilizado pelo handle
    await Queue.add(CancellationEmail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
