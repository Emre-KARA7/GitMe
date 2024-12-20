import { ApiProperty } from '@nestjs/swagger';

export class CreateGitRepoDto {
  @ApiProperty({ example: 'firstRepo' })
  name: string;
  @ApiProperty({ example: '223344' })
  ownerId: string;
}
