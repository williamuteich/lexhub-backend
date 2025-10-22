import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailServiceProtocol } from './email.service';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class NodemailerEmailService implements EmailServiceProtocol {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
    from: string,
    frontendUrl: string,
  ): Promise<void> {
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        from,
        subject: 'Redefinição de Senha',
        template: 'reset-password',
        context: { name, resetLink, expirationTime: 60 },
      });
    } catch (error) {
      throw new HttpException(
        MESSAGES.INTERNAL_ERROR.EMAIL_SEND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
