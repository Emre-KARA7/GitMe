import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({ example: 1 })
  readonly id: number;
  @ApiProperty({ example: 'jhon@example.com' })
  readonly email: string;
}
