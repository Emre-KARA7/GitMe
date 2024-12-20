import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { MName1723565357703 } from './migrations/1723565357703-m_name';

export default new DataSource({
  type: 'postgres',
  host: process.env.DOCKER == 'true' ? 'db' : 'localhost',
  port: 5432,
  // port: parseInt(process.env.TYPEORM_PORT),
  username: 'postgres', // that must be from env
  password: 'postgres',
  database: 'testdb',
  entities: [User],
  migrations: [MName1723565357703],
});
