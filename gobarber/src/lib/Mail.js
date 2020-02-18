import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    // Desestruturando o mailConfig para facilitar na hora de passar os dados.
    const { host, port, secure, auth } = mailConfig;
    // transporter é o nome que o nodemailer utiliza para se comunicar com o server de emails
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null, // Algumas estratégias de envio não possuem usuario
    });
  }

  // Método criado para que as configurações default do nodemailer sejam aplicadas
  // Então o transporter não pode ser chamado direto no controller
  sendEmail(message) {
    return this.transporter.sendMail({
      // Chama tudo que estiver dentro de default no mailConfig
      ...mailConfig.default,
      // tudo que estiver dentro de message
      ...message,
    });
  }
}

export default new Mail();
