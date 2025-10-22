import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { PasswordResetService } from './password-reset.service';
import { RequestResetClientDto, RequestResetUserDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('password-reset')
@ApiTags('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('request-client')
  @ApiOperation({ summary: 'Request password reset for CLIENT by CPF' })
  @ApiOkResponse({ description: 'Reset email sent if CPF exists' })
  async requestResetClient(@Body() dto: RequestResetClientDto): Promise<{ message: string }> {
    return this.passwordResetService.requestPasswordResetClient(dto.cpf);
  }

  @Post('request-user')
  @ApiOperation({ summary: 'Request password reset for USER by email' })
  @ApiOkResponse({ description: 'Reset email sent if email exists' })
  async requestResetUser(@Body() dto: RequestResetUserDto): Promise<{ message: string }> {
    return this.passwordResetService.requestPasswordResetUser(dto.email);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiOkResponse({ description: 'Password reset successfully' })
  @ApiBadRequestResponse({ description: 'Invalid, expired or used token' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    return this.passwordResetService.resetPassword(dto.token, dto.newPassword);
  }
}
