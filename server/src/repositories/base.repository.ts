import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqldbDataSource } from '../datasources';
import { BaseEntity } from '../models/domain/base-entity.model';

type ID = number;

export class BaseRepository<T extends BaseEntity, Relations extends object = {}>
  extends DefaultCrudRepository<T, ID, Relations> {

  private _entityType: string;

  constructor(
    entityClass: typeof BaseEntity & { prototype: T; },
    @inject('datasources.mysqldb') dataSource: MysqldbDataSource,
  ) {
    super(entityClass, dataSource);

    this._entityType = 'erm.' + this.entityClass.name;
  }
}
