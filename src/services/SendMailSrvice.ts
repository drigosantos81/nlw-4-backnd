import nodemailer, { Transporter } from 'nodemailer';
import hendlebars from 'handlebars';
import fs from 'fs';

class SendMailSrvice {
  private client: Transporter

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      this.client = transporter;
    })
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const mailTemplateParse = hendlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'NPS <no-reply@nps.com.br>'
    })

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailSrvice();