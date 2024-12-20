import {
  Body,
  Controller,
  // Delete,
  // Get,
  // Param,
  Post,
  // ParseIntPipe,
  Req,
  Res,
  Param,
  // UploadedFile,
  // UseInterceptors,
} from '@nestjs/common';
import { CreateGitRepoDto } from './dto/create-gitRepo.dto';
import { GitService } from './git.service';
import { ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Response, Request } from 'express';

@Controller('git-repo')
export class GitRepoController {
  constructor(private readonly gitRepoService: GitService) {}

  @Roles() // This is a public route
  @Post('create')
  async createRepo(@Body() createGitRepoDto: CreateGitRepoDto) {
    return this.gitRepoService.createRepository(createGitRepoDto);
  }

  // Endpoint to serve Git commands like git-upload-pack for push
  @Post(':repoName/git-upload-pack')
  async handleGitUploadPack(
    @Param('repoName') repoName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.gitRepoService.handleGitPush(repoName, req, res);
  }
}
