import { handleActions } from 'redux-actions';
import { RootState } from './state';
// import { EmployeeActions } from 'app/actions/employee';
import { EmployeeModel } from 'app/models';

const initialState: RootState.EmployeeState = {
  data: [],
  isLoading: false,
  error: null,
};

export const employeeReducer = handleActions<RootState.EmployeeState, EmployeeModel>(
  {
    // [EmployeeActions.Type.LOGIN_REQUEST]: (state, action) => {
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
    // [EmployeeActions.Type.LOGOUT_REQUEST]: (state, action) => {
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
