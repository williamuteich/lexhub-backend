import { Body, Controller, Post, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SignInDto } from './dto/singnin.dto';
import type { Response, Request } from 'express';
import { AuthTokenGuard } from './guard/auth-token.guard';
import { REQUEST_TOKEN_PAYLOAD } from './common/auth-constants';

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
  async LoginAuth(@Body() signInDto: SignInDto, @Res() response: Response): Promise<void> {
    const result = await this.authService.login(signInDto);
    
    response.cookie('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    response.status(200).json({ success: true, message: 'Login successful' });
  }

  @Get('me')
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the current authenticated user information from token.',
  })
  @ApiOkResponse({
    description: 'User information retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token.',
  })
  async getCurrentUser(@Req() req: Request): Promise<{ user: any }> {
    const payload = req[REQUEST_TOKEN_PAYLOAD];
    if (!payload) {
      throw new Error('Token payload is missing');
    }

    return { 
      user: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        avatar: payload.avatar
      }
    };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Clears the authentication cookie.',
  })
  @ApiOkResponse({
    description: 'Logout successful.',
  })
  async logout(@Res() response: Response): Promise<void> {
    response.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    response.status(200).json({ success: true, message: 'Logout successful' });
  }
}
