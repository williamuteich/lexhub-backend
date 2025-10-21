import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/singnin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hashingPassword/hashing.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashingService: HashingServiceProtocol,
        
        private readonly jwtService: JwtService,
    ){}

    async LoginAuth(signInDto: SignInDto): Promise<{ accessToken: string }> {
        const { email, password } = signInDto
        
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
                status: true,
            }
        })

        if (!user) throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
    
        const validPassword = await this.hashingService.compare(password, user.password)

        if (!validPassword) throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }
        
        const token = await this.jwtService.signAsync(payload)
        return { accessToken: token }
    }
}
