import { createAction } from 'redux-actions';
import { AuthModel } from 'app/models';
// import { TodoModel, AuthModel } from 'app/models';

export namespace AuthActions {
  export enum Type {
    LOGIN_ERROR = 'LOGIN_ERROR',
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',

    WHO_AM_I_ERROR = 'WHO_AM_I_ERROR',
    WHO_AM_I_REQUEST = 'WHO_AM_I_REQUEST',
    WHO_AM_I_SUCCESS = 'WHO_AM_I_SUCCESS',

    LOGOUT_ERROR = 'LOGOUT_ERROR',
    LOGOUT_REQUEST = 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  }

  export const Urls = {
    login: '/auth/login',
    whoAmI: '/auth/whoami',
  }

  // export enum Type {
  //   LOGIN = 'LOGIN',
  //   LOGOUT = 'LOGOUT',
  // }

  interface LoginRequest {
    email: string;
    password: string;
  }

  export const loginRequest = createAction<LoginRequest>(Type.LOGIN_REQUEST);
  export const loginSuccess = createAction<AuthModel>(Type.LOGIN_SUCCESS);
  export const loginError = createAction<string>(Type.LOGIN_ERROR);

  export const whoAmIRequest = createAction(Type.WHO_AM_I_REQUEST);
  export const whoAmISuccess = createAction<AuthModel>(Type.WHO_AM_I_SUCCESS);
  export const whoAmIError = createAction<string>(Type.WHO_AM_I_ERROR);

  export const logoutRequest = createAction(Type.LOGOUT_REQUEST);
  export const logoutSuccess = createAction(Type.LOGOUT_SUCCESS);
  export const logoutError = createAction(Type.LOGOUT_ERROR);
}

export type AuthActions = Omit<typeof AuthActions, 'Type'>;
