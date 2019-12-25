import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';
import { Login } from 'app/containers/Login';
import { Dashboard } from 'app/containers/Dashboard';
import * as AuthApis from 'app/apis/auth';
import { Dispatch, bindActionCreators } from 'redux';
import './style.scss';
import { AuthModel } from 'app/models';


export namespace App {
  export interface Props extends RouteComponentProps<void> {
    auth: RootState.AuthState;
    actions: { whoAmI: AuthApis.whoAmIFunc };
  }
}

@connect(
  (state: RootState): Pick<App.Props, 'auth'> => {
    return { auth: state.auth };
  },
  (dispatch: Dispatch): Pick<App.Props, 'actions'> => ({
    actions: bindActionCreators({ whoAmI: AuthApis.whoAmI }, dispatch),
  })
)
export class App extends React.Component<App.Props> {
  static defaultProps: Partial<App.Props> = {
    auth: {
      data: {
        id: 0,
        organizationId: 0,
        role: AuthModel.ROLE.EMPLOYEE,
        name: '',
        email: '',
        token: '',
      },
      email: '',
      password: '',
      error: null,
      isLoading: true,
      isAdmin: false,
    },
  };

  componentDidMount() {
    this.props.actions.whoAmI();
  }

  componentWillReceiveProps(props: App.Props) {
    if (props.auth.isLoading != this.props.auth.isLoading) {
      this.setState({
        isLoading: this.props.auth.isLoading,
      });
    }
  }

  renderDashboardLoading() {
    return (
      <div className={'fly-center'}>
        <div className="content">
          Welcome...
        </div>
      </div>
    );
  }

  render() {
    const isLoading = this.props.auth.data && this.props.auth.isLoading;
    const isLoggedIn = this.props.auth.data && this.props.auth.data.id > 0;
    const hasToken = this.props.auth.data && this.props.auth.data.token && this.props.auth.data.token.length > 0;

    if (hasToken && isLoading) {
      return this.renderDashboardLoading();
    }

    if (isLoggedIn) {
      return (<Dashboard />);
    }

    return <Login />
  }
}
