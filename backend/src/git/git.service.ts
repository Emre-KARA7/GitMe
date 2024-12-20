import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response, Request } from 'express';
import { exec } from 'child_process';
import * as path from 'path';
import { Repository } from 'typeorm';

import { GitRepo } from './entities/gitRepo.entity';
import { CreateGitRepoDto } from './dto/create-gitRepo.dto';

@Injectable()
export class GitService {
  constructor(
    @InjectRepository(GitRepo)
    private readonly gitRepoRepository: Repository<GitRepo>,
  ) {}

  async createRepository(createGitRepoDto: CreateGitRepoDto) {
    const { name, ownerId } = createGitRepoDto;
    const repoPath = path.join('/git-repos', name + '.git');
    exec(`git init --bare ${repoPath}`, (error) => {
      if (error) {
        throw new Error('Failed to create repository');
      }
    });
    const repo = this.gitRepoRepository.create({
      name,
      path: repoPath,
      ownerId,
    });
    return this.gitRepoRepository.save(repo);
  }

  async handleGitPush(repoName: string, req: Request, res: Response) {
    const repoPath = path.join('/git-repos/', repoName + '.git');

    // Check if the repository exists
    if (!repoPath) {
      throw new NotFoundException('Repository not found');
    }

    // Run git-upload-pack to handle the push process
    const gitProcess = exec(`git-receive-pack ${repoPath}`);

    // Pipe the request body to git and response back to the client
    req.pipe(gitProcess.stdin);
    gitProcess.stdout.pipe(res);
    gitProcess.stderr.pipe(res);

    gitProcess.on('error', (error) => {
      res.status(500).send('Error processing push request');
    });

    gitProcess.on('exit', (code) => {
      if (code !== 0) {
        res.status(500).send(`Git push failed with code ${code}`);
      }
    });
  }
}
