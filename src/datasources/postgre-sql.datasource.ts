import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  name: process.env.DATABASE_CONFIG_NAME,
  connector: 'postgresql',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PostgreSqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'PostgreSQL';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.PostgreSQL', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
