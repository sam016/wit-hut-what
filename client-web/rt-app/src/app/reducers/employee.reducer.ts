import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { Employees as EmployeeActions } from 'app/actions/employees.actions';
import { EmployeeModel } from 'app/models';

const initialState: RootState.EmployeeState = {
  data: [],
  isLoading: false,
  counterLoading: 0,
  error: null,
  map: {},
};

export const employeeReducer = handleActions<RootState.EmployeeState, EmployeeModel>(
  {
    [EmployeeActions.Type.GET_ALL_REQUEST]: (state, action) => {
      return {
        ...state,
        isLoading: true,
        counterLoading: state.counterLoading + 1,
        error: null,
      };
    },
    [EmployeeActions.Type.GET_ALL_SUCCESS]: (state, action) => {
      if (Array.isArray(action.payload)) {
        return {
          data: action.payload,
          map: action.payload.reduce((prev, item) => {
            prev[item.id] = item;
            return prev;
          }, {}),
          isLoading: (state.counterLoading > 1),
          counterLoading: state.counterLoading - 1,
          error: null,
        };
      }
      return state;
    },
    [EmployeeActions.Type.GET_ALL_ERROR]: (state, action) => {
      if (typeof action.payload === 'string') {
        return {
          ...state,
          isLoading: (state.counterLoading > 1),
          counterLoading: state.counterLoading - 1,
          error: action.payload,
        };
      }
      return state;
    },
  },
  initialState
);
