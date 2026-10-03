var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsEnum, MinLength, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
export class RegisterDto {
    mobile;
    password;
    role;
    firstName;
    lastName;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], RegisterDto.prototype, "mobile", void 0);
__decorate([
    IsString(),
    MinLength(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    IsEnum(Role),
    IsOptional(),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
//# sourceMappingURL=register.dto.js.map