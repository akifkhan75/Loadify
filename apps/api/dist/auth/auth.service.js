var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingUser = await this.prisma.account.findUnique({
            where: { mobile: dto.mobile },
        });
        if (existingUser)
            throw new ConflictException('Mobile number already in use');
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
        }
        else if (user.role === 'DRIVER') {
            await this.prisma.driverProfile.create({ data: { accountId: user.id } });
        }
        return this.generateToken(user);
    }
    async login(dto) {
        const user = await this.prisma.account.findUnique({
            where: { mobile: dto.mobile },
        });
        if (!user)
            throw new UnauthorizedException('Invalid credentials');
        const isPasswordValid = await argon2.verify(user.password, dto.password);
        if (!isPasswordValid)
            throw new UnauthorizedException('Invalid credentials');
        return this.generateToken(user);
    }
    generateToken(user) {
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
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map