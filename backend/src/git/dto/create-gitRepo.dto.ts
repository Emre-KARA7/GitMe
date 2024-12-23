import { ApiProperty } from '@nestjs/swagger';

export class CreateGitRepoDto {
  @ApiProperty({ example: 'firstRepo' })
  repoName: string;
  @ApiProperty({ example: 'emre' })
  uniqueUserName: string;
}
