import { createAction } from 'redux-actions';
import { PerformanceReviewModel, EmployeeModel } from 'app/models';
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

    GET_ALL_IN_ORG_ERROR = 'GET_ALL_IN_ORG_PERFORMANCE_REVIEWS_ERROR',
    GET_ALL_IN_ORG_REQUEST = 'GET_ALL_IN_ORG_PERFORMANCE_REVIEWS_REQUEST',
    GET_ALL_IN_ORG_SUCCESS = 'GET_ALL_IN_ORG_PERFORMANCE_REVIEWS_SUCCESS',

    GET_ALL_OF_EMP_ERROR = 'GET_ALL_OF_EMP_PERFORMANCE_REVIEWS_ERROR',
    GET_ALL_OF_EMP_REQUEST = 'GET_ALL_OF_EMP_PERFORMANCE_REVIEWS_REQUEST',
    GET_ALL_OF_EMP_SUCCESS = 'GET_ALL_OF_EMP_PERFORMANCE_REVIEWS_SUCCESS',

    GET_ALL_FOR_EMP_ERROR = 'GET_ALL_FOR_EMP_PERFORMANCE_REVIEWS_ERROR',
    GET_ALL_FOR_EMP_REQUEST = 'GET_ALL_FOR_EMP_PERFORMANCE_REVIEWS_REQUEST',
    GET_ALL_FOR_EMP_SUCCESS = 'GET_ALL_FOR_EMP_PERFORMANCE_REVIEWS_SUCCESS',

    GET_ALL_PERMITTED_EMP_ERROR = 'GET_ALL_PERMITTED_EMP_PERFORMANCE_REVIEW_ERROR',
    GET_ALL_PERMITTED_EMP_REQUEST = 'GET_ALL_PERMITTED_EMP_PERFORMANCE_REVIEW_REQUEST',
    GET_ALL_PERMITTED_EMP_SUCCESS = 'GET_ALL_PERMITTED_EMP_PERFORMANCE_REVIEW_SUCCESS',

    PERMIT_EMP_ACCESS_ERROR = 'PERMIT_EMP_ACCESS_PERFORMANCE_REVIEW_ERROR',
    PERMIT_EMP_ACCESS_REQUEST = 'PERMIT_EMP_ACCESS_PERFORMANCE_REVIEW_REQUEST',
    PERMIT_EMP_ACCESS_SUCCESS = 'PERMIT_EMP_ACCESS_PERFORMANCE_REVIEW_SUCCESS',

    REVOKE_EMP_ACCESS_ERROR = 'REVOKE_EMP_ACCESS_PERFORMANCE_REVIEW_ERROR',
    REVOKE_EMP_ACCESS_REQUEST = 'REVOKE_EMP_ACCESS_PERFORMANCE_REVIEW_REQUEST',
    REVOKE_EMP_ACCESS_SUCCESS = 'REVOKE_EMP_ACCESS_PERFORMANCE_REVIEW_SUCCESS',

    UPDATE_EMP_NAME_ERROR = 'UPDATE_EMP_NAME_PERFORMANCE_REVIEW_ERROR',
    UPDATE_EMP_NAME_REQUEST = 'UPDATE_EMP_NAME_PERFORMANCE_REVIEW_REQUEST',
    UPDATE_EMP_NAME_SUCCESS = 'UPDATE_EMP_NAME_PERFORMANCE_REVIEW_SUCCESS',

    UPDATE_FEEDBACKS_IN_REVIEW_REQUEST = 'UPDATE_FEEDBACKS_IN_PERFORMANCE_REVIEW_REQUEST',
    UPDATE_FEEDBACKS_IN_REVIEW_SUCCESS = 'UPDATE_FEEDBACKS_IN_PERFORMANCE_REVIEW_SUCCESS',
    UPDATE_FEEDBACKS_IN_REVIEW_ERROR = 'UPDATE_FEEDBACKS_IN_PERFORMANCE_REVIEW_ERROR',
  }

  export const Urls = {
    create: '/organizations/{orgId}/employees/{empId}/performance-reviews',
    getAllInOrg: '/organizations/{orgId}/performance-reviews',
    getAllOfEmp: '/organizations/{orgId}/employees/{empId}/performance-reviews',
    getAllForEmp: '/organizations/{orgId}/employees/{empId}/permitted/performance-reviews',
    getById: '/organizations/{orgId}/employees/{empId}/performance-reviews/{id}',
    update: '/organizations/{orgId}/employees/{empId}/performance-reviews/{id}',

    getAllPermittedEmp: '/organizations/{orgId}/employees/{empId}/performance-reviews/{id}/permitted',
    permitEmployeeAccess: '/organizations/{orgId}/employees/{empId}/permit/performance-reviews/{id}',
    revokeEmployeeAccess: '/organizations/{orgId}/employees/{empId}/revoke/performance-reviews/{id}',
  }

  interface PerformanceReviewRequest {
    id?: number;
    organizationId: number;
    employeeId: number;
    name?: string;
  }

  export const createRequest = createAction<PerformanceReviewRequest>(Type.CREATE_REQUEST);
  export const createSuccess = createAction<PerformanceReviewModel>(Type.CREATE_SUCCESS);
  export const createError = createAction<string>(Type.CREATE_ERROR);

  export const getByIdRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId' | 'id'>>(Type.GET_BY_ID_REQUEST);
  export const getByIdSuccess = createAction<PerformanceReviewModel>(Type.GET_BY_ID_SUCCESS);
  export const getByIdError = createAction<string>(Type.GET_BY_ID_ERROR);

  export const getAllInOrgRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId'>>(Type.GET_ALL_IN_ORG_REQUEST);
  export const getAllInOrgSuccess = createAction<Array<PerformanceReviewModel>>(Type.GET_ALL_IN_ORG_SUCCESS);
  export const getAllInOrgError = createAction<string>(Type.GET_ALL_IN_ORG_ERROR);

  export const getAllOfEmpRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId'>>(Type.GET_ALL_OF_EMP_REQUEST);
  export const getAllOfEmpSuccess = createAction<Array<PerformanceReviewModel>>(Type.GET_ALL_OF_EMP_SUCCESS);
  export const getAllOfEmpError = createAction<string>(Type.GET_ALL_OF_EMP_ERROR);

  export const getAllForEmpRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId'>>(Type.GET_ALL_FOR_EMP_REQUEST);
  export const getAllForEmpSuccess = createAction<Array<PerformanceReviewModel>>(Type.GET_ALL_FOR_EMP_SUCCESS);
  export const getAllForEmpError = createAction<string>(Type.GET_ALL_FOR_EMP_ERROR);

  export const getAllPermittedEmpRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId' | 'id'>>(Type.GET_ALL_PERMITTED_EMP_REQUEST);
  export const getAllPermittedEmpSuccess = createAction<BaseModel>(Type.GET_ALL_PERMITTED_EMP_SUCCESS);
  export const getAllPermittedEmpError = createAction<string>(Type.GET_ALL_PERMITTED_EMP_ERROR);

  export const permitEmployeeAccessRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId' | 'id'>>(Type.PERMIT_EMP_ACCESS_REQUEST);
  export const permitEmployeeAccessSuccess = createAction<BaseModel>(Type.PERMIT_EMP_ACCESS_SUCCESS);
  export const permitEmployeeAccessError = createAction<Pick<PerformanceReviewRequest, 'id'>>(Type.PERMIT_EMP_ACCESS_ERROR);

  export const revokeEmployeeAccessRequest = createAction<Pick<PerformanceReviewRequest, 'organizationId' | 'employeeId' | 'id'>>(Type.REVOKE_EMP_ACCESS_REQUEST);
  export const revokeEmployeeAccessSuccess = createAction(Type.REVOKE_EMP_ACCESS_SUCCESS);
  export const revokeEmployeeAccessError = createAction<Pick<PerformanceReviewRequest, 'id'>>(Type.REVOKE_EMP_ACCESS_ERROR);

  export const updateFeedbacksInReviewRequest = createAction<PerformanceReviewModel>(Type.UPDATE_FEEDBACKS_IN_REVIEW_REQUEST);
  export const updateFeedbacksInReviewSuccess = createAction<PerformanceReviewModel>(Type.UPDATE_FEEDBACKS_IN_REVIEW_SUCCESS);
  export const updateFeedbacksInReviewError = createAction<PerformanceReviewModel>(Type.UPDATE_FEEDBACKS_IN_REVIEW_ERROR);

  export const updateEmployeeNamesRequest = createAction<Record<number, EmployeeModel>>(Type.UPDATE_EMP_NAME_REQUEST);
}

export type PerformanceReviews = Omit<typeof PerformanceReviews, 'Type'>;
