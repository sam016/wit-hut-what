import { Employee, EmployeeRelations } from '../models/domain';
import { MysqldbDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { BaseRepository } from './base.repository';

export class EmployeeRepository extends BaseRepository<Employee, EmployeeRelations> {

  constructor(
    @inject('datasources.mysqldb') dataSource: MysqldbDataSource,
  ) {
    super(Employee, dataSource);
  }

  public findByEmail(email: string): Promise<Employee | null> {
    return this.findOne({
      where: {
        email: email,
      },
    });
  }
}
