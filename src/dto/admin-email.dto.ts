import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class BroadcastEmailDTO {
  @ApiProperty({ example: 'Nova funcionalidade no LarAngola!' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: '<p>Olá, confira as novidades...</p>' })
  @IsString()
  @IsNotEmpty()
  html: string;

  @ApiProperty({ 
    example: ['ALL_USERS', 'ALL_AGENTS', 'SPECIFIC_USERS'],
    description: 'Target audience for the broadcast' 
  })
  @IsString()
  @IsNotEmpty()
  targetAudience: 'ALL_USERS' | 'ALL_AGENTS' | 'SPECIFIC_USERS';

  @ApiProperty({ 
    example: ['user_id_1', 'user_id_2'],
    description: 'Required if targetAudience is SPECIFIC_USERS',
    required: false
  })
  @IsArray()
  @IsOptional()
  specificUserIds?: string[];
}
