import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'jhon@example.com' })
  readonly email: string;
  @ApiProperty({ example: 'pass123' })
  readonly password: string;
}
