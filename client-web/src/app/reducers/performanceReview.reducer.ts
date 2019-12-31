import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { PerformanceReviews as PerformanceReviewActions } from 'app/actions/performanceReviews.actions';
import { PerformanceReviewModel, FeedbackModel, EmployeeModel } from 'app/models';

const initialState: RootState.PerformanceReviewState = {
  data: [],
  isLoading: false,
  error: null,
  map: {},
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

      const performanceReview = action.payload as PerformanceReviewModel;
      performanceReview.isLoadingFeedbacks = false;
      performanceReview.feedbacks = [];

      return {
        ...state,
        data: [
          ...state.data,
          performanceReview
        ],
        map: {
          ...state.map,
          [performanceReview.id]: performanceReview,
        },
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

      const performanceReviews = action.payload.map(pr => ({
        ...pr,
        permittedEmployees: [],
        feedbacks: [],
        isLoadingFeedbacks: false,
      } as PerformanceReviewModel));

      return {
        ...state,
        data: performanceReviews,
        map: performanceReviews.reduce((prev: Record<number, PerformanceReviewModel>, item) => {
          prev[item.id] = item;
          return prev;
        }, {}),
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

    // ============================
    // PERMIT EMPLOYEE ACCESS
    //=============================
    [PerformanceReviewActions.Type.PERMIT_EMP_ACCESS_REQUEST]: (state, action) => {
      if (typeof (action.payload) === 'object' && action.payload.id && state.map[action.payload.id]) {
        state.map[action.payload.id].isLoadingFeedbacks = true;
      }

      return {
        ...state,
        isLoading: true,
      };
    },
    [PerformanceReviewActions.Type.PERMIT_EMP_ACCESS_SUCCESS]: (state, action) => {
      if (typeof action.payload !== 'object') {
        return {
          ...state,
          isLoading: false,
          error: 'Error occurred!',
        }
      }

      const feedback = action.payload as any as FeedbackModel;

      state.map[feedback.performanceReviewId].isLoadingFeedbacks = false;
      state.map[feedback.performanceReviewId].permittedEmployees.push(feedback.fromEmployeeId);
      state.map[feedback.performanceReviewId].feedbacks.push(feedback);

      return {
        ...state,
        isLoading: false,
      };
    },
    [PerformanceReviewActions.Type.PERMIT_EMP_ACCESS_ERROR]: (state, action) => {
      if (typeof (action.payload) === 'object' && action.payload.id && state.map[action.payload.id]) {
        state.map[action.payload.id].isLoadingFeedbacks = false;
      }

      return {
        ...state,
        isLoading: false,
        error: action.payload as string,
      };
    },

    // ============================
    // REVOKE EMPLOYEE ACCESS
    //=============================
    [PerformanceReviewActions.Type.REVOKE_EMP_ACCESS_REQUEST]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [PerformanceReviewActions.Type.REVOKE_EMP_ACCESS_SUCCESS]: (state, action) => {
      if (typeof action.payload !== 'object') {
        return {
          ...state,
          isLoading: false,
          error: 'Error occurred!',
        }
      }

      const feedback = action.payload as any as FeedbackModel;
      const permittedEmployees = state.map[feedback.performanceReviewId].permittedEmployees;

      const index = permittedEmployees.indexOf(feedback.fromEmployeeId, 0);
      if (index > -1) {
        permittedEmployees.splice(index, 1);
      }

      state.map[feedback.performanceReviewId].isLoadingFeedbacks = false;

      return {
        ...state,
        isLoading: false,
      };
    },
    [PerformanceReviewActions.Type.REVOKE_EMP_ACCESS_ERROR]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload as string,
      };
    },

    // ============================
    // GET ALL PERMITTED EMPLOYEES
    //=============================
    [PerformanceReviewActions.Type.GET_ALL_PERMITTED_EMP_REQUEST]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [PerformanceReviewActions.Type.GET_ALL_PERMITTED_EMP_SUCCESS]: (state, action) => {
      if (!Array.isArray(action.payload)) {
        return {
          ...state,
          isLoading: false,
          error: 'Error occurred!',
        }
      }

      const result = action.payload as any as {
        ids: Array<number>,
        performanceReviewId: number,
      };
      state.map[result.performanceReviewId].permittedEmployees = result.ids;

      return {
        ...state,
        isLoading: false,
      };
    },
    [PerformanceReviewActions.Type.GET_ALL_PERMITTED_EMP_ERROR]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload as string,
      };
    },

    // ============================
    // UPDATE FEEDBACKS IN PERFORMANCE REVIEW
    //=============================
    [PerformanceReviewActions.Type.UPDATE_FEEDBACKS_IN_REVIEW_REQUEST]: (state, action) => {
      const performanceReview = action.payload as PerformanceReviewModel;

      const index = state.data.findIndex(pr => pr.id == performanceReview.id, 0);
      if (index < 0) {
        return state;
      }

      state.data.splice(index, 1);
      state.data.push(performanceReview);

      state.map[performanceReview.id] = performanceReview;

      return {
        ...state,
      };
    },
    [PerformanceReviewActions.Type.UPDATE_FEEDBACKS_IN_REVIEW_SUCCESS]: (state, action) => {
      const performanceReview = action.payload as PerformanceReviewModel;

      const index = state.data.findIndex(pr => pr.id == performanceReview.id, 0);
      if (index < 0) {
        return state;
      }

      state.data.splice(index, 1);
      state.data.push(performanceReview);

      state.map[performanceReview.id] = performanceReview;

      return {
        ...state,
      };
    },
    [PerformanceReviewActions.Type.UPDATE_FEEDBACKS_IN_REVIEW_ERROR]: (state, action) => {
      const performanceReview = action.payload as PerformanceReviewModel;

      const index = state.data.findIndex(pr => pr.id == performanceReview.id, 0);
      if (index < 0) {
        return state;
      }

      state.data.splice(index, 1);
      state.data.push(performanceReview);

      state.map[performanceReview.id] = performanceReview;

      return {
        ...state,
      };
    },

    // ============================
    // UPDATE EMPLOYEE NAMES
    //=============================
    [PerformanceReviewActions.Type.UPDATE_EMP_NAME_REQUEST]: (state, action) => {
      if (typeof (action.payload) !== 'object') {
        return state;
      }

      const mapEmployees = action.payload as any as Record<number, EmployeeModel>;

      state.data.forEach((pr => {
        pr.employeeName = mapEmployees[pr.employeeId] && mapEmployees[pr.employeeId].name;
      }));

      return {
        ...state,
        isLoading: false,
      };
    },
  },
  initialState,
);
