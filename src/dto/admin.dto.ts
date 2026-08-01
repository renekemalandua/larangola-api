import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class RejectPropertyDTO {
  @ApiProperty({ example: 'Preço acima do mercado' })
  @IsString()
  reason: string;
}

export class CreateAgentDTO {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '923456789' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Corretor' })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiProperty({ example: 'Remax' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: 'Luanda' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'Especialista em imóveis de luxo' })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class VerifyPaymentDTO {
  @ApiProperty({ example: 'Pagamento confirmado via transferência' })
  @IsOptional()
  @IsString()
  notes?: string;
}
