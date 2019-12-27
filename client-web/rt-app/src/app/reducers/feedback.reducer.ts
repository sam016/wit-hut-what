import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { Feedbacks as FeedbackActions } from 'app/actions/feedbacks.action';
import { FeedbackModel, EmployeeModel } from 'app/models';

const initialState: RootState.FeedbackState = {
  data: [],
  isLoading: false,
  counterLoading: 0,
  error: null,
  map: {},
};

export const feedbackReducer = handleActions<RootState.FeedbackState, FeedbackModel | string>(
  {
    // ============================
    // GET ALL FEEDBACKS
    //=============================
    [FeedbackActions.Type.GET_ALL_REQUEST]: (state, action) => {
      return {
        ...state,
        isLoading: true,
        counterLoading: state.counterLoading + 1,
      };
    },
    [FeedbackActions.Type.GET_ALL_SUCCESS]: (state, action) => {
      if (!Array.isArray(action.payload)) {
        return {
          ...state,
          isLoading: (state.counterLoading > 1),
          counterLoading: state.counterLoading - 1,
          error: 'Error occurred!',
        }
      }

      return {
        ...state,
        data: action.payload,
        map: action.payload.reduce((prev: Record<number, FeedbackModel>, item) => {
          prev[item.id] = item;
          return prev;
        }, {}),
        isLoading: false,
      };
    },
    [FeedbackActions.Type.GET_ALL_ERROR]: (state, action) => {
      return {
        ...state,
        isLoading: (state.counterLoading > 1),
        counterLoading: state.counterLoading - 1,
        error: action.payload as string,
      };
    },

    // ============================
    // UPDATE EMPLOYEE NAMES IN ALL FEEDBACKS
    //=============================
    [FeedbackActions.Type.UPDATE_EMP_NAMES_REQUEST]: (state, action) => {
      if (typeof (action.payload) !== 'object') {
        return state;
      }

      const mapEmployees = action.payload as any as Record<number, EmployeeModel>;

      state.data.forEach((pr => {
        pr.forEmployeeName = mapEmployees[pr.forEmployeeId] && mapEmployees[pr.forEmployeeId].name;
        pr.fromEmployeeName = mapEmployees[pr.fromEmployeeId] && mapEmployees[pr.fromEmployeeId].name;
      }));

      return {
        ...state
      };
    },
  },
  initialState
);
