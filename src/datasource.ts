import { DataSource } from 'typeorm';
import migrations from './migrations';
import entities from './entities';
import config from './config';

const dataSource = new DataSource({
  applicationName: 'speech-analysis',
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