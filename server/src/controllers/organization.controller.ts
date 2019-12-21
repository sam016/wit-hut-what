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
import { Organization } from '../models/domain';
import { OrganizationRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class OrganizationController {
  constructor(
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
  ) { }

  @authenticate('jwt')
  @post('/organizations', {
    responses: {
      '200': {
        description: 'Organization model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Organization) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, {
            title: 'NewOrganization',
            exclude: ['id'],
          }),
        },
      },
    })
    organization: Omit<Organization, 'id'>,
  ): Promise<Organization> {
    return this.organizationRepository.create(organization);
  }

  @authenticate('jwt')
  @get('/organizations/count', {
    responses: {
      '200': {
        description: 'Organization model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Organization)) where?: Where<Organization>,
  ): Promise<Count> {
    return this.organizationRepository.count(where);
  }

  @authenticate('jwt')
  @get('/organizations', {
    responses: {
      '200': {
        description: 'Array of Organization model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Organization, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Organization)) filter?: Filter<Organization>,
  ): Promise<Organization[]> {
    return this.organizationRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/organizations', {
    responses: {
      '200': {
        description: 'Organization PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, { partial: true }),
        },
      },
    })
    organization: Organization,
    @param.query.object('where', getWhereSchemaFor(Organization)) where?: Where<Organization>,
  ): Promise<Count> {
    return this.organizationRepository.updateAll(organization, where);
  }

  @authenticate('jwt')
  @get('/organizations/{id}', {
    responses: {
      '200': {
        description: 'Organization model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Organization, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Organization)) filter?: Filter<Organization>
  ): Promise<Organization> {
    return this.organizationRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/organizations/{id}', {
    responses: {
      '204': {
        description: 'Organization PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, { partial: true }),
        },
      },
    })
    organization: Organization,
  ): Promise<void> {
    await this.organizationRepository.updateById(id, organization);
  }

  @authenticate('jwt')
  @put('/organizations/{id}', {
    responses: {
      '204': {
        description: 'Organization PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() organization: Organization,
  ): Promise<void> {
    await this.organizationRepository.replaceById(id, organization);
  }

  @authenticate('jwt')
  @del('/organizations/{id}', {
    responses: {
      '204': {
        description: 'Organization DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.organizationRepository.deleteById(id);
  }
}
