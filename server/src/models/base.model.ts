import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class BaseEntity extends Entity {
  // Define well-known properties here

  @property({
    type: 'number',
    required: true,
    id: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: TDate;

  @property({
    type: 'date',
    required: true,
  })
  modifiedAt: TDate;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BaseEntity>) {
    super(data);
  }
}
