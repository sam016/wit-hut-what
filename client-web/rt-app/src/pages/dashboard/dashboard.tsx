import * as React from "react";
import { Route } from "react-router-dom";

interface IProps {
  exact?: boolean;
  path: string;
  component: React.ComponentType<any>;
}

const Dashboard = ({ component: Component, ...otherProps }: IProps) => (
  <>
    <header>
      ERM Dashboard
    </header>
    <Route
      render={otherProps => (
        <>
          <Component {...otherProps} />
        </>
      )}
    />
  </>
);

export default Dashboard;
