import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findOneByEmail(registerDto.email);

    if (user) {
      throw new BadRequestException('usuario ya existe en la base de datos');
    }

    await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: await bcryptjs.hash(registerDto.password, 10),
    });

    return {
      name: registerDto.name,
      email: registerDto.email,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email Invalid');
    }

    const isPassword = await bcryptjs.compare(loginDto.password, user.password);

    if (!isPassword) {
      throw new UnauthorizedException('password Invalid');
    }

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
    };
  }

  async profile({ email }: { email: string }) {
    const user = await this.usersService.findOneByEmail(email);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      deletedAt: user.deletedAt,
    };
  }
}
