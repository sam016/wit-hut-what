import * as React from 'react';
// import * as style from './style.css';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
// import { AuthActions } from 'app/actions';
import * as AuthApis from 'app/apis/auth';
import * as PerformanceReviewApis from 'app/apis/performanceReview';
import { RootState } from 'app/reducers';
import { Row, Col, Button } from 'react-bootstrap';
import { ProfilePill } from 'app/components/ProfilePill';
import { PerformanceReviewList } from 'app/components/PerformanceReviewList';
import './style.scss';
import { PerformanceReviewCreate } from 'app/components/PerformanceReviewCreate';
import { PerformanceReviewModel } from 'app/models';

export namespace Dashboard {
  export interface Props extends RouteComponentProps<void> {
    auth: RootState.AuthState;
    actions: {
      logout: AuthApis.logoutFunc,
      createPerformanceReview: PerformanceReviewApis.createPerformanceReviewFunc,
    };
    performanceReviews: RootState.PerformanceReviewState,
  }

  export interface State {
    creatingNewPerformanceReview: boolean;
    newPerformanceReview: PerformanceReviewModel,
  }
}

@connect(
  (state: RootState): Pick<Dashboard.Props, 'auth' | 'performanceReviews'> => {
    return {
      auth: state.auth,
      performanceReviews: state.performanceReviews,
    };
  },
  (dispatch: Dispatch): Pick<Dashboard.Props, 'actions'> => ({
    actions: bindActionCreators({
      logout: AuthApis.logout,
      createPerformanceReview: PerformanceReviewApis.createPerformanceReview,
    }, dispatch),
  })
)
export class Dashboard extends React.Component<Dashboard.Props, Dashboard.State> {
  static defaultProps: Partial<Dashboard.Props> = {
  };

  constructor(props: Dashboard.Props, context?: any) {
    super(props, context);
    this.state = {
      creatingNewPerformanceReview: false,
      newPerformanceReview: {
        id: 0,
        name: '',
        createdAt: new Date(0),
        organization: {
          id: (props.auth.data && props.auth.data.organizationId) || 0,
          name: '',
        },
        employee: {
          id: 0,
          name: '',
        },
      },
    }
  }

  handleLogout() {
    const { actions } = this.props;
    actions.logout();
  }

  handlePerformanceReviewSelection(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
  }

  handleNewPerformanceReview() {
    this.setState({ creatingNewPerformanceReview: true });
  }

  handlePerformanceReviewSave() {
    this.props.actions.createPerformanceReview()
  }

  renderHeader = () => (
    <Container className={'header'}>
      <Row className={'site-title h1'}>
        Org ERM
      </Row>
      <Row className={'site-info h5'}>
        Employee Feedback
      </Row>
      <Row className={'float-right'}>
        <ProfilePill logout={this.handleLogout.bind(this)} />
      </Row>
    </Container>);

  renderPerformanceReviewList = () => {
    const { performanceReviews, auth } = this.props;
    const { creatingNewPerformanceReview, newPerformanceReview } = this.state;

    return (
      <Col>
        <Row>
          <div className={'text-align-center'}>
            Performance Reviews
          </div>
        </Row>
        {
          auth.isAdmin
            ? (creatingNewPerformanceReview
              ? (<PerformanceReviewCreate
                item={newPerformanceReview}
                disabled={performanceReviews.isLoading}
                onSave={this.handlePerformanceReviewSave} />)
              : <Button variant="primary" onClick={this.handleNewPerformanceReview.bind(this)} >New</Button>)
            : null
        }
        <PerformanceReviewList items={performanceReviews.data}
          selectedItem={performanceReviews.selected}
          onSelect={this.handlePerformanceReviewSelection} />
      </Col>
    )
  };

  render() {
    return (
      <Container className={'dashboard'}>
        <Row className={'dashboard-header'}>
          {this.renderHeader()}
        </Row>
        <Row className={'dashboard-body'}>
          <Col xs={5} sm={4} lg={3} className='performance-reviews-list-container'>
            {this.renderPerformanceReviewList()}
          </Col>
          <Col xs={7} sm={8} lg={9} >
          </Col>
        </Row>
      </Container>
    );
  }
}
