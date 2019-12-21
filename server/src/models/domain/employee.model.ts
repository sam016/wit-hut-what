import { Entity, model, property, hasMany } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { PerformanceReview } from './performance-review.model';

@model({ settings: { strict: false } })
export class Employee extends BaseEntity {
  // Define well-known properties here

  @property({

  })
  role: string;

  @hasMany(() => PerformanceReview, { keyTo: 'employeeId' })
  performanceReviews?: PerformanceReview[];

  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // describe navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;
