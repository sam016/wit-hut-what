import * as React from 'react';
// import * as style from './style.css';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
// import { AuthActions } from 'app/actions';
import * as AuthApis from 'app/apis/auth';
import * as PerformanceReviewApis from 'app/apis/performanceReview';
import * as EmployeeApis from 'app/apis/employee';
import { RootState } from 'app/reducers';
import { Row, Col, Button } from 'react-bootstrap';
import { ProfilePill } from 'app/components/ProfilePill';
import { PerformanceReviewList } from 'app/components/PerformanceReviewList';
import './style.scss';
import { PerformanceReviewCreate } from 'app/components/PerformanceReviewNew';
import { PerformanceReviewModel } from 'app/models';

export namespace Dashboard {
  export interface Props extends RouteComponentProps<void> {
    auth: RootState.AuthState;
    actions: {
      logout: AuthApis.logoutFunc,
      createPerformanceReview: PerformanceReviewApis.createPerformanceReviewFunc,
      getAllEmployees: EmployeeApis.getAllEmployeesFunc,
      getAllPerformanceReviews: PerformanceReviewApis.getAllPerformanceReviewsForEmpFunc,
    };
    performanceReviews: RootState.PerformanceReviewState,
    employees: RootState.EmployeeState,
  }

  export interface State {
    creatingNewPerformanceReview: boolean;
    newPerformanceReview: PerformanceReviewModel,
    selectedPerformanceReview?: PerformanceReviewModel,
    loadingPerformanceReviews: boolean,
    loadingEmployees: boolean,
  }
}

@connect(
  (state: RootState): Pick<Dashboard.Props, 'auth' | 'performanceReviews' | 'employees'> => {
    return {
      auth: state.auth,
      performanceReviews: state.performanceReviews,
      employees: state.employees,
    };
  },
  (dispatch: Dispatch): Pick<Dashboard.Props, 'actions'> => ({
    actions: bindActionCreators({
      logout: AuthApis.logout,
      createPerformanceReview: PerformanceReviewApis.createPerformanceReview,
      getAllEmployees: EmployeeApis.getAllEmployees,
      getAllPerformanceReviews: PerformanceReviewApis.getAllPerformanceReviewsForEmp,
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
      newPerformanceReview: this.getNewPerformanceReview(props),
      loadingPerformanceReviews: false,
      loadingEmployees: false,
    }
  }

  componentWillReceiveProps(props: Dashboard.Props) {
    const newState: any = {
      loadingPerformanceReviews: this.state.loadingPerformanceReviews,
      loadingEmployees: this.state.loadingEmployees,
      // creatingNewPerformanceReview: this.state.creatingNewPerformanceReview
    };

    if (props.performanceReviews.isLoading != this.state.loadingPerformanceReviews) {
      newState.loadingPerformanceReviews = props.performanceReviews.isLoading;

      if (this.state.creatingNewPerformanceReview
        && this.props.performanceReviews.isLoading === true
        && props.performanceReviews.isLoading === false
        && !props.performanceReviews.error) {
        newState.creatingNewPerformanceReview = false;
      }
    }

    if (props.employees.isLoading != this.state.loadingEmployees) {
      newState.loadingEmployees = props.employees.isLoading;
    }

    this.setState(newState);
  }

  componentDidMount() {
    const orgId = (this.props.auth.data && this.props.auth.data.organizationId) || 0;
    const empId = (this.props.auth.data && this.props.auth.data.id) || 0;
    this.props.actions.getAllPerformanceReviews(orgId, empId);
  }

  getNewPerformanceReview(props: Dashboard.Props): PerformanceReviewModel {
    return {
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
    }
  }

  handleLogout() {
    const { actions } = this.props;
    actions.logout();
  }

  handlePerformanceReviewSelection(event: React.MouseEvent<HTMLElement>, item: PerformanceReviewModel) {
    if (!item) {
      return;
    }
    this.setState({ selectedPerformanceReview: item });
  }

  handleNewPerformanceReview() {
    const organizationId = (this.props.auth.data && this.props.auth.data.organizationId) || 0;

    this.setState({
      creatingNewPerformanceReview: true,
      newPerformanceReview: this.getNewPerformanceReview(this.props)
    });
    this.props.actions.getAllEmployees(organizationId);
  }

  handlePerformanceReviewSave() {
    const { newPerformanceReview } = this.state;
    this.props.actions.createPerformanceReview(newPerformanceReview);
  }

  handlePerformanceReviewCancel() {
    this.setState({ creatingNewPerformanceReview: false });
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
    const { performanceReviews, auth, employees } = this.props;
    const { creatingNewPerformanceReview, newPerformanceReview, selectedPerformanceReview } = this.state;
    const otherEmployees = employees.data.filter(emp => (emp.id !== (auth.data && auth.data.id) || 0));

    newPerformanceReview.employee.id = otherEmployees.length ? otherEmployees[0].id : 0;

    return (
      <Row>
        <Col>
          <div className={'header text-align-center'}>
            Performance Reviews
          </div>
          {
            auth.isAdmin
              ?
              <div>
                {creatingNewPerformanceReview
                  ? (<PerformanceReviewCreate
                    item={newPerformanceReview}
                    employees={otherEmployees}
                    disabled={performanceReviews.isLoading || employees.isLoading}
                    onSave={this.handlePerformanceReviewSave.bind(this)}
                    onCancel={this.handlePerformanceReviewCancel.bind(this)} />)
                  : <Button variant="primary"
                    onClick={this.handleNewPerformanceReview.bind(this)} >New</Button>
                }
              </div>
              : null
          }
          <PerformanceReviewList items={performanceReviews.data}
            selectedItem={selectedPerformanceReview}
            onSelect={this.handlePerformanceReviewSelection.bind(this)} />
        </Col>
      </Row>
    )
  };

  render() {
    return (
      <Container className={'dashboard'}>
        <Row className={'dashboard-header'}>
          <Col>
            {this.renderHeader()}
          </Col>
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
