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
