import { ApiProperty } from '@nestjs/swagger';

export class DeleteGitRepo {
  @ApiProperty({ example: 'emre' })
  uniqueUserName: string;
  @ApiProperty({ example: 'firstRepo' })
  repoName: string;
}
