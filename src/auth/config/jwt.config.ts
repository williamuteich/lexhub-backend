import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET,
    algorithm: 'HS256' as const,
    expiresIn: '1d' as const
}))