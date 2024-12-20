## Features
- JWT session
- Postgres
- Docker
- Migrations
- Type orm
- Auth
- Swagger
- .env
- Bcryp pass
- Users module

# Swagger 
http://localhost:3000/api

# Migrations:
$ pnpm run typeorm:generate-migration

we should import the migration classes manually on typeOrm.config.ts
import { CreatePost1658694616973 } from './migrations/1658694616973-CreatePost';
{
migrations: [CreatePost1658694616973],
}

$ pnpm run typeorm:run-migrations

# Names To Change
packace.json   "name": "nestCoreProject",
main.ts .setTitle('nestCoreProject')
main.ts .setDescription('The nestCoreProject API description')