import { Role } from '@prisma/client';
export declare class RegisterDto {
    mobile: string;
    password: string;
    role?: Role;
    firstName?: string;
    lastName?: string;
}
