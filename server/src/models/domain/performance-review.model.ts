import { model, property, belongsTo } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Employee, EmployeeWithRelations } from './employee.model';

@model()
export class PerformanceReview extends BaseEntity {

  @belongsTo(() => Employee)
  employeeId?: number;

  constructor(data?: Partial<PerformanceReview>) {
    super(data);
  }
}

export interface PerformanceReviewRelations {
  employee?: EmployeeWithRelations;
  // describe navigational properties here
}

export type PerformanceReviewWithRelations = PerformanceReview & PerformanceReviewRelations;
