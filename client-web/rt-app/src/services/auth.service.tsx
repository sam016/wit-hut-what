import appConfig from '../app/app.config';
import { POST } from './api.service';
import { ILoggedInUser } from '../types';

export {
  Login,
}

function Login(email: string, password: string): Promise<ILoggedInUser> {
  return POST<ILoggedInUser>(`${appConfig.apiUrl}/auth/login`, { email, password })
    .then(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    });
}
