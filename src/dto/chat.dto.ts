import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateChatRequestDTO {
  @ApiProperty({ example: 'uuid-of-user1' })
  @IsUUID()
  user1Id: string;

  @ApiProperty({ example: 'uuid-of-user2' })
  @IsUUID()
  user2Id: string;
}

export class UpdateChatRequestDTO {
  @ApiPropertyOptional({ example: 'Last message text' })
  @IsOptional()
  @IsString()
  lastMessage?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unreadCountUser1?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unreadCountUser2?: number;
}
