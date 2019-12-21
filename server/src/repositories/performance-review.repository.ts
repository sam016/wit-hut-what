import { PerformanceReview, PerformanceReviewRelations } from '../models/domain';
import { MysqldbDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { BaseRepository } from './base.repository';

export class PerformanceReviewRepository
  extends BaseRepository<PerformanceReview, PerformanceReviewRelations> {

  constructor(
    @inject('datasources.mysqldb') dataSource: MysqldbDataSource,
  ) {
    super(PerformanceReview, dataSource);
  }
}
