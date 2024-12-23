import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response, Request } from 'express';
import { exec, spawn } from 'child_process';
import { Repository } from 'typeorm';
import * as path from 'path';

import { GitRepo } from './entities/gitRepo.entity';
import { CreateGitRepoDto } from './dto/create-gitRepo.dto';
import { DeleteGitRepo } from './dto/delete-gitRepo.dto';
import { ListCommitsDto } from './dto/listCommits-gitRepo.dto';

@Injectable()
export class GitService {
  constructor(
    @InjectRepository(GitRepo)
    private readonly gitRepoRepository: Repository<GitRepo>,
  ) {}

  async createRepository(createGitRepoDto: CreateGitRepoDto) {
    const { uniqueUserName, repoName } = createGitRepoDto;
    const repoPath = path.join(
      './git-repos',
      uniqueUserName,
      repoName + '.git',
    );
    exec(`git init --bare ${repoPath}`, (error) => {
      if (error) {
        throw new Error('Failed to create repository');
      }
    });
    const repo = this.gitRepoRepository.create({
      name: repoName,
      path: repoPath,
      ownerId: 9999, // this will be the user id fix it
    });
    return this.gitRepoRepository.save(repo);
  }

  // delete a repo
  async deleteRepository(deleteGitRepo: DeleteGitRepo) {
    const repoPath = path.join(
      './git-repos',
      deleteGitRepo.uniqueUserName,
      deleteGitRepo.repoName + '.git',
    );
    exec(`rm -rf ${repoPath}`, (error) => {
      if (error) {
        throw new Error('Failed to delete repository');
      }
    });
    return this.gitRepoRepository.delete({ name: deleteGitRepo.repoName });
  }

  // list all repos
  async listRepositories() {
    return this.gitRepoRepository.find();
  }

  // list all commits in a repo
  async listCommits(listCommitsDto: ListCommitsDto) {
    const repoPath = path.join(
      './git-repos',
      listCommitsDto.uniqueUserName,
      listCommitsDto.repoName,
    );
    const args = ['log', '--pretty']; //=format:%H %an %s', '--'];
    return new Promise((resolve, reject) => {
      exec(`git -C ${repoPath} ${args.join(' ')}`, (error, stdout) => {
        if (error) {
          reject(error);
        }
        resolve(stdout);
      });
    });
  }

  // these will be used in the frontend (UI)

  ////////////////////////////////////////////

  // Info Refs - Advertise repository references (like branches and tags).
  // Endpoint for info/refs to advertise capabilities
  async handleInfoRefs(
    uniqueUserName: string,
    repoName: string,
    service: string,
    res: Response,
  ) {
    const gitService =
      service === 'git-upload-pack' ? 'upload-pack' : 'receive-pack';
    const repoPath = path.join('./git-repos', uniqueUserName, repoName);
    const args = [gitService, '--advertise-refs', '--stateless-rpc', repoPath];
    const gitProcess = spawn('git', args);

    res.setHeader('Content-Type', `application/x-${service}-advertisement`);
    res.write(
      `${(('# service=' + service + '\n').length + 4).toString(16).padStart(4, '0')}# service=${service}\n`,
    );
    res.write('0000');

    gitProcess.stdout.pipe(res);

    gitProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    gitProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Git process exited with code ${code}`);
      }
    });
  }

  //  Git Upload-Pack - For git fetch or git clone.
  async handleGitUploadPack(
    uniqueUserName: string,
    repoName: string,
    req: Request,
    res: Response,
  ) {
    const repoPath = path.join('./git-repos', uniqueUserName, repoName);
    const args = ['upload-pack', '--stateless-rpc', repoPath];
    const gitProcess = spawn('git', args);

    req.pipe(gitProcess.stdin);
    res.setHeader('Content-Type', 'application/x-git-upload-pack-result');
    gitProcess.stdout.pipe(res);
    gitProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    gitProcess.on('close', (code) => {
      if (code !== 0) {
        res.status(500).send(`Git process exited with code ${code}`);
      }
    });
  }

  // Git Receive-Pack - For git push.
  async handleGitReceivePack(
    uniqueUserName: string,
    repoName: string,
    req: Request,
    res: Response,
  ) {
    const repoPath = path.join('./git-repos', uniqueUserName, repoName);
    const args = ['receive-pack', '--stateless-rpc', repoPath];
    const gitProcess = spawn('git', args);

    req.pipe(gitProcess.stdin);
    res.setHeader('Content-Type', 'application/x-git-receive-pack-result');
    gitProcess.stdout.pipe(res);
    gitProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    gitProcess.on('close', (code) => {
      if (code !== 0) {
        res.status(500).send(`Git process exited with code ${code}`);
      }
    });
  }
}
