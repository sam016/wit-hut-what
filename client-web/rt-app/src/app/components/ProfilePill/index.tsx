import * as React from 'react';
import { AuthModel } from 'app/models';
import { RootState } from 'app/reducers';
import { connect } from 'react-redux';
import './style.scss';
import { Button } from 'react-bootstrap';

export namespace ProfilePill {
  export interface Props {
    auth: AuthModel;
    isAdmin: boolean;
    logout: () => void;
  }
}

@connect(
  (state: RootState): Pick<ProfilePill.Props, 'auth' | 'isAdmin'> => {
    return {
      auth: state.auth.data as AuthModel,
      isAdmin: state.auth.isAdmin,
    };
  }
)
export class ProfilePill extends React.Component<ProfilePill.Props> {
  static defaultProps: Partial<ProfilePill.Props> = {
    auth: {
      email: '',
      id: 0,
      name: '',
      organizationId: 0,
      role: AuthModel.ROLE.EMPLOYEE,
      password: null,
      token: '',
    },
  };

  render() {
    const { auth, logout, isAdmin } = this.props;
    return (
      <div className={'profile-pill'}>
        <span className={'user-greeting cursive'}>Welcome,</span> &nbsp;
        <span className="user-info">
          <span className={'user-name'}>{auth.name}</span>
          {
            isAdmin
              ? (<span className={'user-role'}>({AuthModel.ROLE[auth.role]})</span>)
              : null
          }
        </span>
        <Button className={'logout'} onClick={logout}>Logout</Button>
      </div>
    );
  }
}
