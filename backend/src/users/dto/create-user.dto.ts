import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  firstName: string;
  @ApiProperty({ example: 'Doe' })
  lastName: string;
  @ApiProperty({ example: 'jhon@example.com' })
  email: string;
  @ApiProperty({ example: 'pass123' })
  password: string;
}
