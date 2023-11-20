import { DataSource } from 'typeorm';
import migrations from './migrations';
import entities from './entities';
import config from './config';
// const db = config.db();

const dataSource = new DataSource({
  applicationName: 'garbanzo',
  type: 'postgres',
  url: config.dbUrl(),
  entities: entities,
  migrations: migrations,
  uuidExtension: 'pgcrypto',
  migrationsRun: true,
  synchronize: false,
  useUTC: true,
});

export default dataSource;