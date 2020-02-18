import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    // Verificação se é provicer
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications);
  }

  async update(req, res) {
    // Procura por id e já atualiza
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }, // Altera o read para true
      { new: true } // Retorna o novo registro após atualizar
    );

    return res.json(notification);
  }
}

export default new NotificationController();
