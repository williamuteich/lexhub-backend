import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/singnin.dto';

@ApiTags('auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'Login',
    description: 'Authenticates the user and returns a JWT token.',
  })
  @ApiOkResponse({
    description: 'Login successful.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
  })
  async LoginAuth(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    return this.authService.LoginAuth(signInDto);
  }
}
