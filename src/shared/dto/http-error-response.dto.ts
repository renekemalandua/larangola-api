import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorResponseDTO {
  @ApiProperty({
    example: false,
    description: 'Indicates if the request was successful',
  })
  status: boolean;

  @ApiProperty({
    example: 400,
    description: 'HTTP status code of the response',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Invalid input data',
    description: 'Description of the error message',
  })
  message: string;

  @ApiProperty({
    example: '2025-10-14T12:34:56.789Z',
    description: 'Timestamp of when the error occurred',
  })
  timestamp: string;
}
