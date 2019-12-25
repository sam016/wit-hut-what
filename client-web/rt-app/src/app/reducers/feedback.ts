import { handleActions } from 'redux-actions';
import { RootState } from './state';
// import { FeedbackActions } from 'app/actions/feedback';
import { FeedbackModel } from 'app/models';

const initialState: RootState.FeedbackState = {
  data: [],
  isLoading: false,
  error: null,
  map: {},
};

export const feedbackReducer = handleActions<RootState.FeedbackState, FeedbackModel>(
  {
    // [FeedbackActions.Type.LOGIN_REQUEST]: (state, action) => {
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
    // [FeedbackActions.Type.LOGOUT_REQUEST]: (state, action) => {
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
