import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GitRepo } from './entities/gitRepo.entity';
import { GitService } from './git.service';
import { GitRepoController } from './git.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GitRepo])],
  providers: [GitService],
  controllers: [GitRepoController],
})
export class GitRepoModule {}
