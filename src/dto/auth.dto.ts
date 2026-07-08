import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthLoginDTO {
  @ApiProperty({
    required: true,
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthRegisterDTO {
  @ApiProperty({
    required: true,
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'User phone',
    example: '+244912345678',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    required: true,
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    required: true,
    description: 'User name',
    example: 'João Silva',
  })
  @IsString()
  name: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    required: true,
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class VerifyOtpDTO {
  @ApiProperty({
    required: true,
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  otp: string;
}

export class ResetPasswordDTO {
  @ApiProperty({
    required: true,
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  otp: string;

  @ApiProperty({
    required: true,
    description: 'New user password',
    example: 'newpassword123',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
