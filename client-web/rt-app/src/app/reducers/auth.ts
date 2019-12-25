import { handleActions } from 'redux-actions';
import { RootState } from './state';
// import { TodoActions } from 'app/actions/todos';
import { AuthActions } from 'app/actions/auth';
import { AuthModel } from 'app/models';

const initialState: RootState.AuthState = {
  data: {
    id: 0,
    name: '',
    organizationId: 0,
    role: AuthModel.ROLE.EMPLOYEE,
    token: localStorage.getItem('auth:token') || '',
  },
  isLoading: false,
  error: null,
  email: null,
  password: null,
  isAdmin: false,
};

export const authReducer = handleActions<RootState.AuthState, AuthModel | string>(
  {
    [AuthActions.Type.LOGIN_REQUEST]: (state, action) => {
      if (typeof action.payload === 'object' && action.payload.email && action.payload.password) {
        return {
          ...state,
          data: null,
          isLoading: true,
          error: null,
          email: action.payload.email,
          password: action.payload.password,
        };
      }
      return state;
    },
    [AuthActions.Type.LOGIN_SUCCESS]: (state, action) => {
      if (typeof action.payload === 'object' && action.payload.token) {
        return {
          ...state,
          data: action.payload,
          isLoading: false,
          error: null,
          isAdmin: action.payload.role !== AuthModel.ROLE.EMPLOYEE,
        };
      }
      return state;
    },
    [AuthActions.Type.LOGIN_ERROR]: (state, action) => {
      if (typeof action.payload === 'string') {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      }
      return state;
    },

    [AuthActions.Type.LOGOUT_REQUEST]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [AuthActions.Type.LOGOUT_SUCCESS]: (state, action) => {
      return {
        data: null,
        isLoading: false,
        error: null,
        email: null,
        password: null,
        isAdmin: false,
      };
    },

    [AuthActions.Type.WHO_AM_I_REQUEST]: (state) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    },
    [AuthActions.Type.WHO_AM_I_SUCCESS]: (state, action) => {
      if (typeof action.payload === 'object' && typeof (action.payload.id) !== 'undefined') {
        return {
          ...state,
          data: action.payload,
          isLoading: false,
          error: null,
          isAdmin: action.payload.role !== AuthModel.ROLE.EMPLOYEE,
        };
      }
      return state;
    },
    [AuthActions.Type.WHO_AM_I_ERROR]: (state, action) => {
      if (typeof action.payload === 'string') {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      }
      return state;
    },
  },
  initialState
);
