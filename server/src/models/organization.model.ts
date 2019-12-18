import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base.model';

@model()
export class Organization extends BaseEntity {
  constructor(data?: Partial<Organization>) {
    super(data);
  }
}

export interface OrganizationRelations {
  // describe navigational properties here
}

export type OrganizationWithRelations = Organization & OrganizationRelations;
