import { Controller, Get, Query } from '@nestjs/common';
import { EmailServiceProtocol } from './email.service';
import { ApiTags, ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

@Controller('email')
@ApiTags('email')
export class EmailController {
  constructor(private readonly emailService: EmailServiceProtocol) {}

  @Get('test-reset')
  @ApiOperation({ summary: 'Test password reset email', description: 'Send a test password reset email (development only)' })
  @ApiQuery({ name: 'email', required: true, example: 'test@example.com' })
  @ApiQuery({ name: 'name', required: true, example: 'João Silva' })
  @ApiQuery({ name: 'from', required: true, example: '"Sistema" <noreply@seuapp.com>' })
  @ApiOkResponse({ description: 'Test email sent successfully' })
  async testResetEmail(
    @Query('email') email: string,
    @Query('name') name: string,
    @Query('from') from: string,
  ): Promise<{ message: string }> {
    const testToken = 'test-token-123456';
    const frontendUrl = 'http://localhost:3001';
    
    await this.emailService.sendPasswordResetEmail(email, name, testToken, from, frontendUrl);
    
    return { message: 'Test email sent successfully' };
  }
}
