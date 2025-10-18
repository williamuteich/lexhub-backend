import { Injectable } from '@nestjs/common';
import { HashingServiceProtocol } from "./hashing.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService implements HashingServiceProtocol {
    hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
    compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}