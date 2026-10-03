import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            mobile: any;
            role: any;
            firstName: any;
            lastName: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            mobile: any;
            role: any;
            firstName: any;
            lastName: any;
        };
    }>;
    private generateToken;
}
