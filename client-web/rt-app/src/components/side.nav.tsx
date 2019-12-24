import * as React from "react";
import { connect } from "react-redux";

import { NavLink } from "react-router-dom";
import { IAppState, ILoggedInUser } from "../types";

interface IProps {
  siteName: string,
  user: ILoggedInUser | null;
}

const AppHeader = ({ siteName, user }: IProps) => {
  if (!user) {
    return <div>User is not logged in</div>;
  }

  const dashboardPill = <div className="site-header">
    <NavLink to="/dashboard">{siteName}</NavLink>
  </div>;

  const userProfilePill = <div className="profile-pill">
    <NavLink to="/dashboard/profile">{user.name}</NavLink>
  </div>;

  return <div className="app-header">
    {dashboardPill}
    {userProfilePill}
  </div>;
};

const mapStateToProps = (state: IAppState) => ({
  user: state.loggedInUser,
  siteName: state.siteName
});

export default connect(mapStateToProps)(AppHeader);
