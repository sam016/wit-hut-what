import * as React from 'react';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import * as AuthApis from 'app/apis/auth.api';
import * as PerformanceReviewApis from 'app/apis/performanceReview.api';
import * as EmployeeApis from 'app/apis/employee.api';
import * as FeedbackApis from 'app/apis/feedback.api';
import { RootState } from 'app/reducers';
import { Row, Col, Button, InputGroup } from 'react-bootstrap';
import { ProfilePill } from 'app/components/ProfilePill';
import { PerformanceReviewList } from 'app/components/PerformanceReviewList';
import { PerformanceReviewCreate } from 'app/components/PerformanceReviewNew';
import { PerformanceReviewModel, EmployeeModel, FeedbackModel } from 'app/models';
import { FeedbackList } from 'app/components/FeedbackList';
import { SelectEmployees } from 'app/components/SelectEmployees';
import './style.scss';
import { FeedbackEdit } from 'app/components/FeedbackEdit';

export namespace Dashboard {
  export interface Props extends RouteComponentProps<void> {
    auth: RootState.AuthState;
    actions: {
      logout: AuthApis.logoutFunc,
      createPerformanceReview: PerformanceReviewApis.createPerformanceReviewFunc,
      getAllEmployees: EmployeeApis.getAllEmployeesFunc,
      getAllPerformanceReviews: PerformanceReviewApis.getAllPerformanceReviewsForEmpFunc,
      permitEmployeeAccessToFeedback: PerformanceReviewApis.permitEmployeeAccessFunc,
      revokeEmployeeAccessToFeedback: PerformanceReviewApis.revokeEmployeeAccessFunc,
      getAllPerformanceReviewFeedback: FeedbackApis.getAllFeedbacksFunc,
      updatePerformanceReviewFeedback: FeedbackApis.updateFeedbackFunc
    };
    performanceReviews: RootState.PerformanceReviewState,
    employees: RootState.EmployeeState,
    feedbacks: RootState.FeedbackState,
  }

  export interface State {
    creatingNewPerformanceReview: boolean;
    loadingEmployees: boolean;
    loadingPerformanceReviews: boolean;
    loadingFeedbacks: boolean,
    newPerformanceReview: PerformanceReviewModel;
    selectedNewEmployeeForFeedback?: EmployeeModel;
    selectedPerformanceReview?: PerformanceReviewModel;
  }
}

@connect(
  (state: RootState): Pick<Dashboard.Props, 'auth' | 'performanceReviews' | 'employees' | 'feedbacks'> => {
    return {
      auth: state.auth,
      performanceReviews: state.performanceReviews,
      employees: state.employees,
      feedbacks: state.feedbacks,
    };
  },
  (dispatch: Dispatch): Pick<Dashboard.Props, 'actions'> => ({
    actions: bindActionCreators({
      logout: AuthApis.logout,
      createPerformanceReview: PerformanceReviewApis.createPerformanceReview,
      getAllEmployees: EmployeeApis.getAllEmployees,
      getAllPerformanceReviews: PerformanceReviewApis.getAllPerformanceReviewsForEmp,
      permitEmployeeAccessToFeedback: PerformanceReviewApis.permitEmployeeAccess,
      revokeEmployeeAccessToFeedback: PerformanceReviewApis.revokeEmployeeAccess,
      getAllPerformanceReviewFeedback: FeedbackApis.getAllFeedbacks,
      updatePerformanceReviewFeedback: FeedbackApis.updateFeedback,
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
      loadingFeedbacks: false,
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
      if (!newState.loadingEmployees) {
        this.updateSelectedEmployeeForFeedback();
      }
    }

    if (this.state.loadingFeedbacks !== props.feedbacks.isLoading) {
      newState.loadingFeedbacks = props.feedbacks.isLoading;
      if (!newState.loadingFeedbacks) {
        this.updateSelectedEmployeeForFeedback();
      }
    }

    this.setState(newState);
  }

  componentDidMount() {
    if (!this.props.auth.data) {
      return;
    }
    const orgId = this.props.auth.data.organizationId;
    const empId = this.props.auth.data.id;
    this.props.actions.getAllPerformanceReviews(orgId, empId);
    this.props.actions.getAllEmployees(orgId);
  }

  getNewPerformanceReview(props: Dashboard.Props): PerformanceReviewModel {
    return {
      id: 0,
      name: '',
      createdAt: new Date(0),
      organizationId: (props.auth.data && props.auth.data.organizationId) || 0,
      organizationName: '',
      employeeId: 0,
      employeeName: '',
      permittedEmployees: [],
      feedbacks: [],
      isLoadingFeedbacks: false,
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
    this.props.actions.getAllPerformanceReviewFeedback(item);
    this.setState({
      selectedPerformanceReview: item,
      // loadingFeedbacks: true,
    });
  }

  updateSelectedEmployeeForFeedback() {
    // const { feedbacks } = this.props;
    const { selectedPerformanceReview, selectedNewEmployeeForFeedback } = this.state;

    console.log('--updateSelectedEmployeeForFeedback');

    if (!selectedPerformanceReview) {
      return;
    }

    // debugger;

    const empsInFeedbacks = selectedPerformanceReview.feedbacks.map(f => f.fromEmployeeId);


    // if (!selectedPerformanceReview || !selectedPerformanceReview.feedbacks) {
    //   return;
    // }

    // // debugger;

    // const feedbacksInReview = feedbacks.data.filter(f => f.performanceReviewId == selectedPerformanceReview.id);

    // const empsInFeedbacks = feedbacksInReview.map(f => f.fromEmployeeId);

    const filteredEmployees = this.props.employees.data
      .filter(emp => empsInFeedbacks.indexOf(emp.id) < 0 && selectedPerformanceReview.employeeId !== emp.id);

    if (filteredEmployees.length
      && (!selectedNewEmployeeForFeedback || filteredEmployees.indexOf(selectedNewEmployeeForFeedback) < 0)) {
      this.setState({ selectedNewEmployeeForFeedback: filteredEmployees[0] });
    }
  }

  handleNewPerformanceReview() {
    this.setState({
      creatingNewPerformanceReview: true,
      newPerformanceReview: this.getNewPerformanceReview(this.props),
    });
  }

  handlePerformanceReviewSave() {
    const { newPerformanceReview } = this.state;
    this.props.actions.createPerformanceReview(newPerformanceReview);
  }

  handlePerformanceReviewCancel() {
    this.setState({ creatingNewPerformanceReview: false });
  }

  handleFeedbackNewEmployee(item: EmployeeModel) {
    console.log('--selectedNewEmployeeForFeedback', JSON.stringify(item, null, 2));
    this.setState({
      selectedNewEmployeeForFeedback: item,
    })
  }

  handleAllowEmployee() {
    if (!this.props.auth.data) {
      return;
    }

    const { selectedNewEmployeeForFeedback, selectedPerformanceReview } = this.state;

    // debugger;

    if (!selectedNewEmployeeForFeedback || !selectedPerformanceReview) {
      return;
    }

    console.log('--selectedNewEmployeeForFeedback', JSON.stringify(selectedNewEmployeeForFeedback, null, 2));

    const { organizationId } = this.props.auth.data;

    this.props.actions.permitEmployeeAccessToFeedback(
      organizationId,
      selectedNewEmployeeForFeedback.id,
      selectedPerformanceReview
    );
  }

  handleFeedbackSave(item: FeedbackModel) {
    this.props.actions.updatePerformanceReviewFeedback(item);
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

    newPerformanceReview.employeeId = otherEmployees.length ? otherEmployees[0].id : 0;

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

  renderPerformanceReviewView = () => {
    const { auth, employees, feedbacks } = this.props;
    const {
      selectedPerformanceReview: item,
      loadingFeedbacks,
    } = this.state;

    if (!item) {
      return <Row>
        <Col>
          <p className="msg-on-wall">
            Select a Performance review
          </p>
        </Col>
      </Row>
    }

    const filteredFeedbacks = feedbacks.data.filter(f => f.performanceReviewId === item.id && f.fromEmployeeId !== (auth.data && auth.data.id));
    const empsInFeedbacks = filteredFeedbacks.map(f => f.fromEmployeeId);
    const feedbackFromLoggedInUser = feedbacks.data.find(f => f.performanceReviewId === item.id && f.fromEmployeeId === (auth.data && auth.data.id));

    const filteredEmployees = employees.data.filter(emp => empsInFeedbacks.indexOf(emp.id) < 0 && item.employeeId !== emp.id);

    const areAdminFieldsDisabled = !filteredEmployees.length
      || employees.isLoading
      || loadingFeedbacks
      || item.isLoadingFeedbacks;

    return (<Row>
      <Col className="performance-review-view-container">
        <div className="header-container">
          <div className="header">
            {item.name}
          </div>
          <div className="header-info">
            <span className="for-text cursive">for</span>
            <span className="for-emp">
              {item.employeeName}
            </span>
          </div>
        </div>
        {
          auth.isAdmin
            ? (<div>
              <InputGroup>
                <SelectEmployees items={filteredEmployees}
                  disabled={areAdminFieldsDisabled}
                  onSelect={this.handleFeedbackNewEmployee.bind(this)} />
                <InputGroup.Append>
                  <Button variant="primary"
                    onClick={this.handleAllowEmployee.bind(this)}
                    disabled={areAdminFieldsDisabled}
                  >Allow Employee</Button>
                </InputGroup.Append>
              </InputGroup>
            </div>)
            : null
        }
        <FeedbackList items={filteredFeedbacks} isLoading={item.isLoadingFeedbacks} />
        {
          feedbackFromLoggedInUser ?
            <FeedbackEdit item={feedbackFromLoggedInUser}
              disabled={feedbacks.isLoading}
              onSave={this.handleFeedbackSave.bind(this)} />
            : null
        }
      </Col>
    </Row>);
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
          <Col xs={4} sm={5} lg={3} className='performance-reviews-list-container'>
            {this.renderPerformanceReviewList()}
          </Col>
          <Col xs={8} sm={7} lg={9} >
            {this.renderPerformanceReviewView()}
          </Col>
        </Row>
      </Container>
    );
  }
}
