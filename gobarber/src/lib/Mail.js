import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

import { resolve } from 'path';

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

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // Fazendo as configurações das templates
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
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
