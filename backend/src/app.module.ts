import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GitRepoModule } from './git/git.module';
import { RolesGuard } from './auth/roles.guard';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
      cache: true, // cache the loaded .env file faster loading
      // process.env.DATABASE_USER  // access env variables
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DOCKER == 'true' ? 'db' : 'localhost',
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: process.env.IS_PRODUCTION == 'true' ? false : true,
      migrationsTableName: 'migration_records',
      migrations: [
        process.env.IS_PRODUCTION == 'true'
          ? 'dist/migrations/*.js'
          : 'src/migrations/*.ts',
      ],
    }),
    UsersModule,
    AuthModule,
    GitRepoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // global guard
      provide: APP_GUARD,
      useClass: RolesGuard, // protect all routes
    },
  ],
})
export class AppModule {}
