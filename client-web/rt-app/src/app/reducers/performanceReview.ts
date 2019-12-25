import { handleActions } from 'redux-actions';
import { RootState } from './state';
// import { PerformanceReviewActions } from 'app/actions/performanceReview';
import { PerformanceReviewModel } from 'app/models';

const initialState: RootState.PerformanceReviewState = {
  data: [],
  isLoading: false,
  error: null,
};

export const performanceReviewReducer = handleActions<RootState.PerformanceReviewState, PerformanceReviewModel>(
  {
    // [PerformanceReviewActions.Type.LOGIN_REQUEST]: (state, action) => {
    //   if (action.payload && action.payload.email && action.payload.password) {
    //     return {
    //       data: null,
    //       isLoading: true,
    //       error: null,
    //       email: action.payload.email,
    //       password: action.payload.password,
    //     };
    //   }
    //   return state;
    // },
    // [PerformanceReviewActions.Type.LOGOUT_REQUEST]: (state, action) => {
    //   if (action.payload) {
    //     localStorage.clear();
    //     return {
    //       data: null,
    //       isLoading: false,
    //       error: null,
    //       email: null,
    //       password: null,
    //     };
    //   }
    //   return state;
    // },
  },
  initialState
);
