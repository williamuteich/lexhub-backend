import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailServiceProtocol } from 'src/email/email.service';
import { HashingServiceProtocol } from 'src/auth/hashingPassword/hashing.service';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { randomBytes } from 'crypto';

@Injectable()
export class PasswordResetService {
  private readonly emailFrom = '"Sistema de Gestão" <noreply@seuapp.com>';
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailServiceProtocol,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async requestPasswordResetClient(cpf: string): Promise<{ message: string }> {

    const client = await this.prisma.client.findUnique({
      where: { cpf },
      select: { email: true, name: true },
    });

    if (!client) {
      return { message: MESSAGES.PASSWORD_RESET.EMAIL_SENT };
    }

    const token = await this.generateAndSaveToken(client.email);
    await this.emailService.sendPasswordResetEmail(
      client.email,
      client.name,
      token,
      this.emailFrom,
      this.frontendUrl,
    );

    return { message: MESSAGES.PASSWORD_RESET.EMAIL_SENT };
  }

  async requestPasswordResetUser(email: string): Promise<{ message: string }> {

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { email: true, name: true },
    });

    if (!user) {
      return { message: MESSAGES.PASSWORD_RESET.EMAIL_SENT };
    }

    const token = await this.generateAndSaveToken(user.email);
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      token,
      this.emailFrom,
      this.frontendUrl,
    );

    return { message: MESSAGES.PASSWORD_RESET.EMAIL_SENT };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const tokenPreview = token.substring(0, 8);

    const resetToken = await this.validateToken(token);
    const hashedPassword = await this.hashingService.hash(newPassword);
    
    await this.updateUserPassword(resetToken.email, hashedPassword);
    await this.markTokenAsUsed(token);

    return { message: MESSAGES.PASSWORD_RESET.SUCCESS };
  }

  private async validateToken(token: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      throw new HttpException(
        MESSAGES.PASSWORD_RESET.INVALID_TOKEN,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (resetToken.used) {
      throw new HttpException(
        MESSAGES.PASSWORD_RESET.TOKEN_USED,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (new Date() > resetToken.expiresAt) {
      throw new HttpException(
        MESSAGES.PASSWORD_RESET.TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    return resetToken;
  }

  private async updateUserPassword(email: string, hashedPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
      return;
    }

    const client = await this.prisma.client.findUnique({ where: { email } });

    if (!client) {
      throw new HttpException(
        MESSAGES.PASSWORD_RESET.INVALID_TOKEN,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.client.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  private async markTokenAsUsed(token: string): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
  }

  private async generateAndSaveToken(email: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    return token;
  }
}
