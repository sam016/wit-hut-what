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
  HttpErrors,
} from '@loopback/rest';
import { generateJwt } from '../utils/auth';
import { EmployeeRepository } from '../repositories';
import { Employee } from '../models/domain';
import { LoginResponse } from '../models/responses/auth';
import { LoginRequest } from '../models/requests/auth';
import { WhoAmIResponse } from '../models/responses/auth/whoami.response';
import { inject, Getter } from '@loopback/context';
import { SecurityBindings, UserProfile } from '@loopback/security';

export class AuthController {
  constructor(

    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,

    @inject.getter(SecurityBindings.USER)
    readonly getCurrentUser: Getter<UserProfile>,
  ) { }

  @post('/auth/login', {
    responses: {
      '200': {
        description: 'Employee model instance',
        content: { 'application/json': { schema: getModelSchemaRef(LoginResponse) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginRequest, {
            title: 'Login user',
          }),
        },
      },
    })
    request: LoginRequest,
  ): Promise<LoginResponse> {
    const employee = await this.employeeRepository.findByEmail(request.email);

    if (!employee) {
      // TODO: add http error
      throw new Error('Invalid credentials')
    }

    const jwtToken = generateJwt(employee as Employee);

    return {
      token: jwtToken.token,
      exp: jwtToken.expiresAt,
    };
  }

  @post('/auth/whoami', {
    responses: {
      '200': {
        description: 'Current user info',
        content: { 'application/json': { schema: getModelSchemaRef(WhoAmIResponse) } },
      },
    },
  })
  async whoami(): Promise<WhoAmIResponse> {
    const user = await this.getCurrentUser();

    return {
      profile: {
        id: 0,
        email: user.email || '',
        name: user.name || '',
      },
      exp: 0,
    };
  }
}
