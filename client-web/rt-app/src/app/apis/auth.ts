import { Dispatch } from "redux";
import { AuthActions } from "../actions/auth";
import { POST, GET } from "./fetch";
import { AuthModel } from "app/models";

export const login: loginFunc = (email: string, password: string) => ((dispatch: Dispatch) => {
  const body = { email, password };
  dispatch(AuthActions.loginRequest(body));

  const url = AuthActions.Urls.login;

  POST<AuthModel>({ url, body })
    .then(auth => {
      localStorage.setItem('auth:token', auth.token);
      dispatch(AuthActions.loginSuccess(auth));
    })
    .catch(error => {
      dispatch(AuthActions.loginError(error));
    });
});

export const whoAmI: whoAmIFunc = () => ((dispatch: Dispatch) => {
  dispatch(AuthActions.whoAmIRequest());

  const token = localStorage.getItem('auth:token');
  if (!token || token.length <= 0) {
    dispatch(AuthActions.whoAmISuccess({
      id: 0,
      name: '',
      organizationId: 0,
      role: AuthModel.ROLE.EMPLOYEE,
      token: '',
    }));
    return;
  }

  const url = AuthActions.Urls.whoAmI;

  GET<AuthModel>({ url })
    .then(auth => {
      dispatch(AuthActions.whoAmISuccess(auth));
    })
    .catch(error => {
      dispatch(AuthActions.whoAmIError(error));
    });
});

export const logout:logoutFunc = () => ((dispatch: Dispatch) => {
  dispatch(AuthActions.logoutRequest());

  localStorage.removeItem('auth:token');

  dispatch(AuthActions.logoutSuccess());
});

export type loginFunc = (email: string, password: string) => void;
export type whoAmIFunc = () => void;
export type logoutFunc = () => void;
