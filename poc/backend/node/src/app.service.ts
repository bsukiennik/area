import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { LoginRequestDto } from './login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  health() {
    return { status: 'ok' };
  }

  async getUsers() {
    try {
      const users = await this.usersRepository.find();
      return users.map((u) => ({
        id: Number(u.id),
        username: u.username,
        email: u.email,
        created_at: u.createdAt,
      }));
    } catch (err: any) {
      throw new InternalServerErrorException({ error: err?.message ?? 'Internal server error' });
    }
  }

  async login(input: LoginRequestDto) {
    if (!input?.email || !input?.password) {
      throw new BadRequestException({ error: 'Invalid request' });
    }

    let user: User | null;
    try {
      user = await this.usersRepository.findOne({ where: { email: input.email } });
    } catch {
      throw new InternalServerErrorException({ error: 'Could not query user' });
    }

    if (!user || user.password !== input.password) {
      throw new UnauthorizedException({ error: 'Invalid username or password' });
    }

    const now = Math.floor(Date.now() / 1000);
    const claims = {
      username: user.username,
      sub: String(user.id),
      exp: now + 24 * 60 * 60,
      iat: now,
    };

    try {
      const token = jwt.sign(claims, process.env.JWT_SECRET || '', {
        algorithm: 'HS256',
      });
      return {
        token,
        user: {
          id: Number(user.id),
          username: user.username,
          email: user.email,
        },
      };
    } catch {
      throw new InternalServerErrorException({ error: 'Could not generate token' });
    }
  }
}
