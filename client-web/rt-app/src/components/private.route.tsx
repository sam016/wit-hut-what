import * as React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from 'react-router-dom';
import { IAppState } from "../types";

interface IProps {
  exact?: boolean;
  isAuthenticated: boolean | null;
  path: string;
  component: React.ComponentType<any>;
}

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  ...otherProps }: IProps) => {
  if (isAuthenticated === false) {
    // history.push("/log-in");
    // alert("this is a logged in route, you are logged out, redirected to log in");
    return <Route
      render={() => (
        <>
          <Redirect
            to={{
              pathname: "/login",
              // state: { from: location }
            }}
          />
        </>
      )}
    />;
  }

  return <Route
    render={otherProps => (
      <>
        <Component {...otherProps} />
      </>
    )}
  />;
}

const mapStateToProps = (state: IAppState) => ({
  isAuthenticated: (state.loggedInUser != null)
});

export default connect(mapStateToProps)(PrivateRoute);
