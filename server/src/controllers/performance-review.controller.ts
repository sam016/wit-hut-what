import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { PerformanceReview } from '../models/domain';
import { PerformanceReviewRepository } from '../repositories';

export class PerformanceReviewController {
  constructor(
    @repository(PerformanceReviewRepository)
    public performanceReviewRepository: PerformanceReviewRepository,
  ) { }

  @post('/performance-reviews', {
    responses: {
      '200': {
        description: 'PerformanceReview model instance',
        content: { 'application/json': { schema: getModelSchemaRef(PerformanceReview) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PerformanceReview, {
            title: 'NewPerformanceReview',
            exclude: ['id'],
          }),
        },
      },
    })
    performanceReview: Omit<PerformanceReview, 'id'>,
  ): Promise<PerformanceReview> {
    return this.performanceReviewRepository.create(performanceReview);
  }

  @get('/performance-reviews/count', {
    responses: {
      '200': {
        description: 'PerformanceReview model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PerformanceReview)) where?: Where<PerformanceReview>,
  ): Promise<Count> {
    return this.performanceReviewRepository.count(where);
  }

  @get('/performance-reviews', {
    responses: {
      '200': {
        description: 'Array of PerformanceReview model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PerformanceReview, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PerformanceReview)) filter?: Filter<PerformanceReview>,
  ): Promise<PerformanceReview[]> {
    return this.performanceReviewRepository.find(filter);
  }

  @patch('/performance-reviews', {
    responses: {
      '200': {
        description: 'PerformanceReview PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PerformanceReview, { partial: true }),
        },
      },
    })
    performanceReview: PerformanceReview,
    @param.query.object('where', getWhereSchemaFor(PerformanceReview)) where?: Where<PerformanceReview>,
  ): Promise<Count> {
    return this.performanceReviewRepository.updateAll(performanceReview, where);
  }

  @get('/performance-reviews/{id}', {
    responses: {
      '200': {
        description: 'PerformanceReview model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PerformanceReview, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(PerformanceReview)) filter?: Filter<PerformanceReview>
  ): Promise<PerformanceReview> {
    return this.performanceReviewRepository.findById(id, filter);
  }

  @patch('/performance-reviews/{id}', {
    responses: {
      '204': {
        description: 'PerformanceReview PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PerformanceReview, { partial: true }),
        },
      },
    })
    performanceReview: PerformanceReview,
  ): Promise<void> {
    await this.performanceReviewRepository.updateById(id, performanceReview);
  }

  @put('/performance-reviews/{id}', {
    responses: {
      '204': {
        description: 'PerformanceReview PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() performanceReview: PerformanceReview,
  ): Promise<void> {
    await this.performanceReviewRepository.replaceById(id, performanceReview);
  }

  @del('/performance-reviews/{id}', {
    responses: {
      '204': {
        description: 'PerformanceReview DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.performanceReviewRepository.deleteById(id);
  }
}
