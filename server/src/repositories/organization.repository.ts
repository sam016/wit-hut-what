import { Organization, OrganizationRelations } from '../models/domain';
import { MysqldbDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { BaseRepository } from './base.repository';

export class OrganizationRepository extends BaseRepository<Organization, OrganizationRelations> {

  constructor(
    @inject('datasources.mysqldb') dataSource: MysqldbDataSource,
  ) {
    super(Organization, dataSource);
  }
}
