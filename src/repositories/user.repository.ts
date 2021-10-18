import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '../datasources/postgre-sql.datasource';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {
  constructor(
    @inject('datasources.PostgreSQL') dataSource: PostgreSqlDataSource,
  ) {
    super(User, dataSource);
  }
}
