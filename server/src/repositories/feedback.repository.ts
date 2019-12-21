import { Feedback, FeedbackRelations } from '../models/domain';
import { MysqldbDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { BaseRepository } from './base.repository';

export class FeedbackRepository extends BaseRepository<Feedback, FeedbackRelations> {

  constructor(
    @inject('datasources.mysqldb') dataSource: MysqldbDataSource,
  ) {
    super(Feedback, dataSource);
  }
}
