import * as React from 'react';
import { InputType } from 'zlib';
import { AuthActions } from '../../redux/actions/auth.action';
import { connect } from 'react-redux';
import { IAppState } from '../../types';

interface IProps {
  logout: () => void;
  login: (email: string, password: string) => void;
  loggingIn: boolean;
}

class State {
  email: string = '';
  password: string = '';
  submitted: boolean = false;
}

class LoginPage extends React.Component<IProps, State> {

  constructor(props: IProps) {
    super(props);

    // reset login status
    this.props.logout();

    this.state = {
      email: '',
      password: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state;
    if (email && password) {
      this.props.login(email, password);
    }
  }


  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value: string = e.target as any;
    if (e.target.name == 'email') {
      this.setState({ email: value });
    }
    else if (e.target.name == 'password') {
      this.setState({ password: value });
    }
  }

  render() {
    const { loggingIn } = this.props;
    return <div className="login-page">
      <form onSubmit={this.handleSubmit}>
        <input type="email" name="email" onChange={this.handleChange} />
        <input type="password" name="password" onChange={this.handleChange} />
        <button disabled={loggingIn}>{loggingIn?"Logging In...":"Login"}</button>
      </form>
    </div>;
  }
}


function mapStateToProps(state: IAppState) {
  const { loggingIn } = state;
  return { loggingIn };
}

const actionCreators = {
  login: AuthActions.login,
};

const connectedLoginPage = connect(mapStateToProps, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };
