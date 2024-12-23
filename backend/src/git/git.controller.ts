import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GitService } from './git.service';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
// dto's
import { CreateGitRepoDto } from './dto/create-gitRepo.dto';
import { DeleteGitRepo } from './dto/delete-gitRepo.dto';
import { ListCommitsDto } from './dto/listCommits-gitRepo.dto';

@ApiTags('Git')
@Controller('')
export class GitRepoController {
  constructor(private readonly gitRepoService: GitService) {}

  // create a repo
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    type: CreateGitRepoDto,
  })
  @ApiOperation({
    summary: 'Create a new git repository, use in UI',
    description: 'Create a new git repository, use in UI',
  })
  @Roles() // This is a public route
  @Post('create-repo')
  async createRepo(@Body() createGitRepoDto: CreateGitRepoDto) {
    return this.gitRepoService.createRepository(createGitRepoDto);
  }
  // delete a repo
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete a git repository, use in UI',
    description: 'Delete a git repository, use in UI',
  })
  @Roles() // This is a public route
  @Delete(':uniqueUserName/:repoName')
  async deleteRepo(
    @Param('uniqueUserName') uniqueUserName: string,
    @Param('repoName') repoName: string,
  ) {
    const deleteGitRepo = {
      repoName,
      uniqueUserName,
    } as DeleteGitRepo;
    return this.gitRepoService.deleteRepository(deleteGitRepo);
  }

  // list all repos
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List all git repositories, use in UI',
    description: 'List all git repositories, use in UI',
  })
  @Roles() // This is a public route
  @Get('repos')
  async listRepos() {
    return this.gitRepoService.listRepositories();
  }

  // list all commits in a repo
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List all commits in a git repository, use in UI',
    description: 'List all commits in a git repository, use in UI',
  })
  @Roles() // This is a public route
  @Get(':uniqueUserName/:repoName/commits')
  async listCommits(
    @Param('uniqueUserName') uniqueUserName: string,
    @Param('repoName') repoName: string,
  ) {
    const listCommitsDto = {
      uniqueUserName,
      repoName,
    } as ListCommitsDto;
    return this.gitRepoService.listCommits(listCommitsDto);
  }

  //////////////////////////

  // Info Refs - Advertise repository references (like branches and tags).
  // Endpoint for info/refs to advertise capabilities
  @Roles() // This is a public route
  @ApiOperation({
    summary: 'Advertise repository references, no UI',
    description: 'Advertise repository references, no UI',
  })
  @Get(':uniqueUserName/:repoName/info/refs')
  async getInfoRefs(
    @Param('uniqueUserName') uniqueUserName: string,
    @Param('repoName') repoName: string,
    @Query('service') service: string,
    @Res() res: Response,
  ) {
    if (!service) {
      throw new HttpException(
        'Service parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.gitRepoService.handleInfoRefs(
      uniqueUserName,
      repoName,
      service,
      res,
    );
  }

  //  Git Upload-Pack - For git fetch or git clone.
  @Roles() // This is a public route
  @ApiOperation({
    summary: 'For git fetch or git clone, no UI',
    description: 'For git fetch or git clone, no UI',
  })
  @Post(':uniqueUserName/:repoName/git-upload-pack')
  async gitUploadPack(
    @Param('uniqueUserName') uniqueUserName: string,
    @Param('repoName') repoName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.gitRepoService.handleGitUploadPack(
      uniqueUserName,
      repoName,
      req,
      res,
    );
  }

  // Git Receive-Pack - For git push.
  @Roles() // This is a public route
  @ApiOperation({
    summary: 'For git push, no UI',
    description: 'For git push, no UI',
  })
  @Post(':uniqueUserName/:repoName/git-receive-pack')
  async gitReceivePack(
    @Param('repoName') repoName: string,
    @Param('uniqueUserName') uniqueUserName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.gitRepoService.handleGitReceivePack(
      uniqueUserName,
      repoName,
      req,
      res,
    );
  }

  // well.. we know "git ropos" are actually directories
}
