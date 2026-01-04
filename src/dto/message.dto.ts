import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMessageRequestDTO {
  @ApiProperty({ example: 'uuid-of-chat' })
  @IsUUID()
  chatId: string;

  @ApiProperty({ example: 'uuid-of-sender' })
  @IsUUID()
  senderId: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class UpdateMessageRequestDTO {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
