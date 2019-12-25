import { createAction } from 'redux-actions';
import { PerformanceReviewModel } from 'app/models';
import { BaseModel } from 'app/models/BaseModel';
// import { TodoModel, AuthModel } from 'app/models';

export namespace PerformanceReviews {
  export enum Type {
    CREATE_ERROR = 'CREATE_PERFORMANCE_REVIEW_ERROR',
    CREATE_REQUEST = 'CREATE_PERFORMANCE_REVIEW_REQUEST',
    CREATE_SUCCESS = 'CREATE_PERFORMANCE_REVIEW_SUCCESS',

    GET_BY_ID_ERROR = 'GET_PERFORMANCE_REVIEW_BY_ID_ERROR',
    GET_BY_ID_REQUEST = 'GET_PERFORMANCE_REVIEW_BY_ID_REQUEST',
    GET_BY_ID_SUCCESS = 'GET_PERFORMANCE_REVIEW_BY_ID_SUCCESS',

    GET_ALL_ERROR = 'GET_ALL_PERFORMANCE_REVIEWS_ERROR',
    GET_ALL_REQUEST = 'GET_ALL_PERFORMANCE_REVIEWS_REQUEST',
    GET_ALL_SUCCESS = 'GET_ALL_PERFORMANCE_REVIEWS_SUCCESS',

    PERMIT_EMP_ERROR = 'PERMIT_EMP_PERFORMANCE_REVIEW_ERROR',
    PERMIT_EMP_REQUEST = 'PERMIT_EMP_PERFORMANCE_REVIEW_REQUEST',
    PERMIT_EMP_SUCCESS = 'PERMIT_EMP_PERFORMANCE_REVIEW_SUCCESS',

    DENY_EMP_ERROR = 'DENY_EMP_PERFORMANCE_REVIEW_ERROR',
    DENY_EMP_REQUEST = 'DENY_EMP_PERFORMANCE_REVIEW_REQUEST',
    DENY_EMP_SUCCESS = 'DENY_EMP_PERFORMANCE_REVIEW_SUCCESS',
  }

  export const Urls = {
    create: '/organizations/{orgId}/employees/{empId}/performance-reviews',
    getAll: '/organizations/{orgId}/employees/{empId}/performance-reviews',
    getById: '/organizations/{orgId}/employees/{empId}/performance-reviews/{id}',
    update: '/organizations/{orgId}/employees/{empId}/performance-reviews/{id}',
  }

  interface PerformanceReviewRequest {
    id?: number;
    organizationId: number;
    employeeId: number;
    name?: string;
  }

  export const createRequest = createAction<PerformanceReviewRequest>(Type.CREATE_REQUEST);
  export const createSuccess = createAction<PerformanceReviewModel>(Type.CREATE_SUCCESS);
  export const createError = createAction<'error'>(Type.CREATE_ERROR);

  export const getByIdRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId' | 'id'>>(Type.GET_BY_ID_REQUEST);
  export const getByIdSuccess = createAction<PerformanceReviewModel>(Type.GET_BY_ID_SUCCESS);
  export const getByIdError = createAction<'error'>(Type.GET_BY_ID_ERROR);

  export const getAllRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId'>>(Type.GET_ALL_REQUEST);
  export const getAllSuccess = createAction<Array<PerformanceReviewModel>>(Type.GET_ALL_SUCCESS);
  export const getAllError = createAction<'error'>(Type.GET_ALL_ERROR);

  export const permitEmployeeRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId' | 'id'>>(Type.PERMIT_EMP_REQUEST);
  export const permitEmployeeSuccess = createAction<BaseModel>(Type.PERMIT_EMP_SUCCESS);
  export const permitEmployeeError = createAction<'error'>(Type.PERMIT_EMP_ERROR);

  export const denyEmployeeRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId' | 'id'>>(Type.DENY_EMP_REQUEST);
  export const denyEmployeeSuccess = createAction(Type.DENY_EMP_SUCCESS);
  export const denyEmployeeError = createAction<'error'>(Type.DENY_EMP_ERROR);
}

export type PerformanceReviews = Omit<typeof PerformanceReviews, 'Type'>;
