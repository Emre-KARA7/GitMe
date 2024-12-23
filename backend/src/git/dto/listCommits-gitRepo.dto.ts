import { ApiProperty } from '@nestjs/swagger';

export class ListCommitsDto {
  @ApiProperty({ example: 'emre', required: true })
  uniqueUserName: string;
  @ApiProperty({ example: 'firstRepo', required: true })
  repoName: string;
  @ApiProperty({ example: 1, required: false })
  page?: number;
}
