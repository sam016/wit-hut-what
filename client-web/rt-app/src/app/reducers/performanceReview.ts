import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { PerformanceReviews as PerformanceReviewActions } from 'app/actions/performanceReview';
import { PerformanceReviewModel } from 'app/models';

const initialState: RootState.PerformanceReviewState = {
  data: [],
  isLoading: false,
  error: null,
};

export const performanceReviewReducer = handleActions<RootState.PerformanceReviewState, PerformanceReviewModel | string>(
  {
    [PerformanceReviewActions.Type.CREATE_REQUEST]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [PerformanceReviewActions.Type.CREATE_SUCCESS]: (state, action) => {
      if (typeof action.payload !== 'object') {
        return {
          ...state,
          isLoading: false,
          error: 'Error occurred!',
        }
      }

      return {
        ...state,
        data: [
          ...state.data,
          action.payload
        ],
        isLoading: false,
      };
    },
    [PerformanceReviewActions.Type.CREATE_ERROR]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload as string,
      };
    },

    // ============================
    // GET ALL FOR EMPLOYEE
    //=============================
    [PerformanceReviewActions.Type.GET_ALL_FOR_EMP_REQUEST]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [PerformanceReviewActions.Type.GET_ALL_FOR_EMP_SUCCESS]: (state, action) => {
      if (!Array.isArray(action.payload)) {
        return {
          ...state,
          isLoading: false,
          error: 'Error occurred!',
        }
      }

      return {
        ...state,
        data: action.payload,
        isLoading: false,
      };
    },
    [PerformanceReviewActions.Type.GET_ALL_FOR_EMP_ERROR]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload as string,
      };
    },
  },
  initialState
);
