import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model()
export class Organization extends BaseEntity {
  // Define well-known properties here

  constructor(data?: Partial<Organization>) {
    super(data);
  }
}

export interface OrganizationRelations {
  // describe navigational properties here
}

export type OrganizationWithRelations = Organization & OrganizationRelations;
