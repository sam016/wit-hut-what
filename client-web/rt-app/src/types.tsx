export interface IAlertMessage {
  type: string;
  message: string;
}

export interface ILoggedInUser {
  id?: string;
  name?: string;
  email: string;
  token?: string;
  expiresAt?: number;
}

export interface IEmployeeState{

}
export interface IOrganizationState{

}

export interface IAppState {
  siteName: string;
  loggedInUser: (ILoggedInUser | null);
  loggingIn: boolean;
  employees: IEmployeeState[];
  organizations: IOrganizationState[];
}
