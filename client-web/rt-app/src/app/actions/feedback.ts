import { createAction } from 'redux-actions';
import {  FeedbackModel } from 'app/models';

export namespace Feedbacks {
  export enum Type {
    CREATE_ERROR = 'CREATE_FEEDBACK_ERROR',
    CREATE_REQUEST = 'CREATE_FEEDBACK_REQUEST',
    CREATE_SUCCESS = 'CREATE_FEEDBACK_SUCCESS',

    GET_BY_ID_ERROR = 'GET_FEEDBACK_BY_ID_ERROR',
    GET_BY_ID_REQUEST = 'GET_FEEDBACK_BY_ID_REQUEST',
    GET_BY_ID_SUCCESS = 'GET_FEEDBACK_BY_ID_SUCCESS',

    GET_ALL_ERROR = 'GET_ALL_FEEDBACKS_ERROR',
    GET_ALL_REQUEST = 'GET_ALL_FEEDBACKS_REQUEST',
    GET_ALL_SUCCESS = 'GET_ALL_FEEDBACKS_SUCCESS',

    UPDATE_ERROR = 'UPDATE_FEEDBACK_ERROR',
    UPDATE_REQUEST = 'UPDATE_FEEDBACK_REQUEST',
    UPDATE_SUCCESS = 'UPDATE_FEEDBACK_SUCCESS',
  }

  export const createRequest = createAction<'orgId' | 'empId' | 'performanceReviewId' | 'comment' | 'rating'>(Type.CREATE_REQUEST);
  export const createSuccess = createAction<FeedbackModel>(Type.CREATE_SUCCESS);
  export const createError = createAction<'error'>(Type.CREATE_ERROR);

  export const getByIdRequest = createAction<'orgId' | 'empId' | 'performanceReviewId' | 'id'>(Type.GET_BY_ID_REQUEST);
  export const getByIdSuccess = createAction<FeedbackModel>(Type.GET_BY_ID_SUCCESS);
  export const getByIdError = createAction<'error'>(Type.GET_BY_ID_ERROR);

  export const getAllRequest = createAction<'orgId' | 'empId' | 'performanceReviewId'>(Type.GET_ALL_REQUEST);
  export const getAllSuccess = createAction<Array<FeedbackModel>>(Type.GET_ALL_SUCCESS);
  export const getAllError = createAction<'error'>(Type.GET_ALL_ERROR);

  export const updateRequest = createAction<'orgId' | 'empId' | 'performanceReviewId' | 'id' | 'comment' | 'rating'>(Type.UPDATE_REQUEST);
  export const updateSuccess = createAction(Type.UPDATE_SUCCESS);
  export const updateError = createAction<'error'>(Type.UPDATE_ERROR);
}

export type Feedbacks = Omit<typeof Feedbacks, 'Type'>;
