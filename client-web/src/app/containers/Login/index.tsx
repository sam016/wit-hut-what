import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import * as AuthApis from 'app/apis/auth.api';
import { RootState } from 'app/reducers';
import { TodoModel } from 'app/models';
import { Col, Row } from 'react-bootstrap';
import './index.scss';

// const FILTER_VALUES = (Object.keys(TodoModel.Filter) as (keyof typeof TodoModel.Filter)[]).map(
//   (key) => TodoModel.Filter[key]
// );

// const FILTER_FUNCTIONS: Record<TodoModel.Filter, (todo: TodoModel) => boolean> = {
//   [TodoModel.Filter.SHOW_ALL]: () => true,
//   [TodoModel.Filter.SHOW_ACTIVE]: (todo) => !todo.completed,
//   [TodoModel.Filter.SHOW_COMPLETED]: (todo) => todo.completed
// };

export namespace Login {
  export interface Props extends RouteComponentProps<void> {
    auth: RootState.AuthState;
    actions: { login: AuthApis.loginFunc };
    filter: TodoModel.Filter;
  }

  export interface State {
    email: string;
    password: string;
    error: string | null;
  }
}

@connect(
  (state: RootState): Pick<Login.Props, 'auth'> => {
    return { auth: state.auth };
  },
  (dispatch: Dispatch): Pick<Login.Props, 'actions'> => ({
    actions: bindActionCreators({ login: AuthApis.login }, dispatch),
  })
)
export class Login extends React.Component<Login.Props, Login.State> {
  static defaultProps: Partial<Login.Props> = {
    filter: TodoModel.Filter.SHOW_ALL
  };

  constructor(props: Login.Props, context?: any) {
    super(props, context);

    this.state = {
      email: 'test@123.com',
      password: 'stringer',
      error: '',
    };
  }

  componentWillUpdate(props: Login.Props) {
    const { isLoading } = this.props.auth;
    if (isLoading != props.auth.isLoading) {
      this.setState({ error: props.auth.error });
    }
  }

  handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    const type: string = (event.target as any).type as string;
    const value: string = (event.target as any).value as string;
    if (type === 'email') {
      this.setState({ email: value });
    } else {
      this.setState({ password: value });
    }
  }

  handleLogin(event: React.FormEvent) {
    const { email, password } = this.state;
    event.preventDefault();
    this.props.actions.login(email, password);
    // this.props.dispatch(this.props.login(email, password));
  }

  render() {
    const { isLoading, error } = this.props.auth;

    return (
      <Container id={'container-login'}>
        <Col className={'fly-center'} xs={'12'} sm={'10'} md={'6'}>
          <Row className={'col-header'}>
            <h2>Login</h2>
          </Row>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={this.handleInputChange.bind(this)} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
            </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={this.handleInputChange.bind(this)} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading} onClick={this.handleLogin.bind(this)}>
              Submit
          </Button>
            {
              error ?
                (<Alert variant='danger'>
                  {error}
            </Alert>) : null
            }
          </Form>
        </Col>
      </Container>
    );
  }
}
