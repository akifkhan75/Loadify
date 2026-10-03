import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.account.findUnique({
      where: { mobile: dto.mobile },
    });
    if (existingUser) throw new ConflictException('Mobile number already in use');

    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.prisma.account.create({
      data: {
        mobile: dto.mobile,
        password: hashedPassword,
        role: dto.role || 'USER',
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    if (user.role === 'USER') {
      await this.prisma.userProfile.create({ data: { accountId: user.id } });
    } else if (user.role === 'DRIVER') {
      await this.prisma.driverProfile.create({ data: { accountId: user.id } });
    }

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.account.findUnique({
      where: { mobile: dto.mobile },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, mobile: user.mobile, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        mobile: user.mobile,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
