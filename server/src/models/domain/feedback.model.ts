import { model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model()
export class Feedback extends BaseEntity {

  constructor(data?: Partial<Feedback>) {
    super(data);
  }
}

export interface FeedbackRelations {
  // describe navigational properties here
}

export type FeedbackWithRelations = Feedback & FeedbackRelations;
