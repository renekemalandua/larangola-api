import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSubscriptionPaymentRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  planId: string;
}

export class CreateSubscriptionPaymentResponseDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;
}
