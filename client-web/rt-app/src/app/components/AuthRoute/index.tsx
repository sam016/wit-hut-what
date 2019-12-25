import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { RootState } from 'app/reducers';
import { connect } from 'react-redux';

export namespace AuthRoute {
  export interface Props extends RouteProps {
    isLoggedIn: boolean;
  }
}

@connect(
  (state: RootState): Pick<AuthRoute.Props, 'isLoggedIn'> => {
    return { isLoggedIn: state.auth.data != null };
  }
)
export class AuthRoute extends React.Component<AuthRoute.Props> {
  static defaultProps: Partial<AuthRoute.Props> = {
    isLoggedIn: false,
  };

  render() {
    return (
      <Route {...this.props}
        render={(props) => this.props.isLoggedIn
          ? (<React.Component {...props} />)
          : (<Redirect to={{
            pathname: "/",
            state: { from: props.location }
          }} />)}
      />
    );
  }
}
