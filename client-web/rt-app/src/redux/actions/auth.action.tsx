import { UserConstants } from '../../constants';
import * as UserService from '../../services/auth.service';
import { AlertActions } from './alert.actions';
// import { history } from '../_helpers';
import { Dispatch } from 'redux';
import { ILoggedInUser } from '../../types';



export const AuthActions = {
  login,
  // logout, // TODO: impement me
  // register, // TODO: impement me
  // forgotPassword, // TODO: impement me
};

function login(email: string, password: string) {
  return (dispatch: Dispatch) => {
    dispatch(request({ email }));

    UserService.Login(email, password)
      .then(
        (user: ILoggedInUser) => {
          dispatch(success(user));
          // history.push('/'); //FIXME: usage?
        },
        (error: string) => {
          dispatch(failure(error.toString()));
          dispatch(AlertActions.error(error.toString()));
        }
      );
  };

  function request(user: ILoggedInUser) { return { type: UserConstants.LOGIN_REQUEST, user } }
  function success(user: ILoggedInUser) { return { type: UserConstants.LOGIN_SUCCESS, user } }
  function failure(error: string) { return { type: UserConstants.LOGIN_FAILURE, error } }
}

// TODO: implement me
// function logout() {
//   UserService.logout();
//   return { type: UserConstants.LOGOUT };
// }

// TODO: implement me
// function register(user) {
//   return dispatch => {
//     dispatch(request(user));

//     UserService.register(user)
//       .then(
//         user => {
//           dispatch(success());
//           history.push('/login');
//           dispatch(AlertActions.success('Registration successful'));
//         },
//         error => {
//           dispatch(failure(error.toString()));
//           dispatch(AlertActions.error(error.toString()));
//         }
//       );
//   };

//   function request(user) { return { type: UserConstants.REGISTER_REQUEST, user } }
//   function success(user) { return { type: UserConstants.REGISTER_SUCCESS, user } }
//   function failure(error) { return { type: UserConstants.REGISTER_FAILURE, error } }
// }

// TODO: implement me
// function forgotPassword() {
//   return dispatch => {
//     dispatch(request());

//     UserService.forgotPassword()
//       .then(
//         users => dispatch(success(users)),
//         error => dispatch(failure(error.toString()))
//       );
//   };

//   function request() { return { type: UserConstants.FORGOT_PASSWORD_REQUEST } }
//   function success(users) { return { type: UserConstants.FORGOT_PASSWORD_SUCCESS, users } }
//   function failure(error) { return { type: UserConstants.FORGOT_PASSWORD_FAILURE, error } }
// }
