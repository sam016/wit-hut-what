import { createAction } from 'redux-actions';
import { EmployeeModel } from 'app/models';

export namespace Employees {
  export enum Type {
    CREATE_ERROR = 'CREATE_EMPLOYEE_ERROR',
    CREATE_REQUEST = 'CREATE_EMPLOYEE_REQUEST',
    CREATE_SUCCESS = 'CREATE_EMPLOYEE_SUCCESS',

    GET_BY_ID_ERROR = 'GET_EMPLOYEE_BY_ID_ERROR',
    GET_BY_ID_REQUEST = 'GET_EMPLOYEE_BY_ID_REQUEST',
    GET_BY_ID_SUCCESS = 'GET_EMPLOYEE_BY_ID_SUCCESS',

    GET_ALL_ERROR = 'GET_ALL_EMPLOYEES_ERROR',
    GET_ALL_REQUEST = 'GET_ALL_EMPLOYEES_REQUEST',
    GET_ALL_SUCCESS = 'GET_ALL_EMPLOYEES_SUCCESS',

    UPDATE_ERROR = 'UPDATE_EMPLOYEE_ERROR',
    UPDATE_REQUEST = 'UPDATE_EMPLOYEE_REQUEST',
    UPDATE_SUCCESS = 'UPDATE_EMPLOYEE_SUCCESS',
  }

  export const Urls = {
    create: '/organizations/{orgId}/employees',
    getAll: '/organizations/{orgId}/employees',
    getById: '/organizations/{orgId}/employees/{empId}',
    update: '/organizations/{orgId}/employees/{empId}',
  }

  export const createRequest = createAction<Pick<EmployeeModel, 'organizationId' | 'name' | 'email' | 'password'>>(Type.CREATE_REQUEST);
  export const createSuccess = createAction<EmployeeModel>(Type.CREATE_SUCCESS);
  export const createError = createAction<'error'>(Type.CREATE_ERROR);

  export const getByIdRequest = createAction<Pick<EmployeeModel, 'organizationId' | 'id'>>(Type.GET_BY_ID_REQUEST);
  export const getByIdSuccess = createAction<EmployeeModel>(Type.GET_BY_ID_SUCCESS);
  export const getByIdError = createAction<'error'>(Type.GET_BY_ID_ERROR);

  export const getAllRequest = createAction<Pick<EmployeeModel, 'organizationId'>>(Type.GET_ALL_REQUEST);
  export const getAllSuccess = createAction<Array<EmployeeModel>>(Type.GET_ALL_SUCCESS);
  export const getAllError = createAction<'error'>(Type.GET_ALL_ERROR);

  export const updateRequest = createAction<Pick<EmployeeModel, 'organizationId' | 'id' | 'name' | 'email' | 'password'>>(Type.UPDATE_REQUEST);
  export const updateSuccess = createAction<Array<EmployeeModel>>(Type.UPDATE_SUCCESS);
  export const updateError = createAction<'error'>(Type.UPDATE_ERROR);
}

export type Employees = Omit<typeof Employees, 'Type'>;
