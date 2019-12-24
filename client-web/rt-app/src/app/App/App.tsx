import React from 'react';
import { connect } from 'react-redux';
import {
  Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import logo from './logo.svg';

import { history } from '../app.history';
import PrivateRoute from '../../components/private.route';
import { HomePage } from '../../pages/home';
import { LoginPage } from '../../pages/auth';
import { IAlertMessage } from '../../types';
import './App.css';
import Dashboard from '../../pages/dashboard/dashboard';

interface IProps {
  clearAlerts: () => void;
  alert: IAlertMessage;
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      this.props.clearAlerts();
    });
  }

  render() {
    const { alert } = this.props;
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="col-sm-8 col-sm-offset-2">
            {alert.message &&
              <div className={`alert ${alert.type}`}>{alert.message}</div>
            }
            <Router history={history}>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/login" component={LoginPage} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <Redirect from="*" to="/" />
              </Switch>
            </Router>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
