import * as React from 'react';
import { PerformanceReviewModel, EmployeeModel } from 'app/models';
import { Form, Button, Alert } from 'react-bootstrap';

export namespace PerformanceReviewCreate {
  export interface Props {
    item: PerformanceReviewModel,
    error?: string,
    disabled?: boolean,
    onSave: React.FormEventHandler<HTMLElement>;
    onCancel: React.MouseEventHandler<HTMLElement>;
    employees: Array<EmployeeModel>;
  }

  export interface State {
    disabled: boolean,
  }
}

export class PerformanceReviewCreate extends React.Component<PerformanceReviewCreate.Props, PerformanceReviewCreate.State> {
  static defaultProps: Partial<PerformanceReviewCreate.Props> = {
    item: {
      id: 0,
      name: '',
      employeeId: 0,
      employeeName: '',
      organizationId: 0,
      organizationName: '',
      permittedEmployees: [],
      feedbacks: [],
      isLoadingFeedbacks: false,
      createdAt: new Date(0),
    },
    employees: [],
  };

  constructor(props: PerformanceReviewCreate.Props, context?: any) {
    super(props, context);

    this.state = {
      disabled: props.disabled || false,
    };
  }

  componentWillReceiveProps(props: PerformanceReviewCreate.Props) {
    const { disabled } = this.props;
    if (disabled != props.disabled) {
      this.setState({ disabled: (props.disabled || false) });
    }
  }

  handleInputChange(key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { item } = this.props;
    if (key === 'employeeId') {
      item.employeeId = parseInt(event.target.value);
    } else if (key === 'title') {
      item.name = event.target.value;
    }
  }

  handleFormSubmit(event: React.FormEvent<HTMLElement>) {
    const { item } = this.props;
    event.preventDefault();
    if (item.employeeId && item.name) {
      this.props.onSave(event);
    }
  }

  render() {
    const { disabled, error, employees, onCancel } = this.props;

    return (
      <div className={'performance-review-item performance-review-create'} >
        <Form>
          <div className="input-group mb-3">
            <select className="custom-select"
              onChange={this.handleInputChange.bind(this, 'employeeId')}
              disabled={disabled}
            >
              {employees.map((employee, index) => (<option key={employee.id} value={employee.id}>{employee.name}</option>))}
            </select>
          </div>

          <Form.Group controlId="formPerformanceReviewTitle">
            <Form.Control type="text" placeholder="Review Title"
              onChange={this.handleInputChange.bind(this, 'title')}
              required
              disabled={disabled} />
          </Form.Group>

          <Button variant="primary" type="submit"
            onClick={this.handleFormSubmit.bind(this)}
            disabled={disabled}>
            Submit
          </Button>
          <Button variant="danger"
            className={'float-right'}
            onClick={onCancel}
            disabled={disabled}>
            Cancel
          </Button>
          {
            error ?
              (<Alert variant='danger'>
                {error}
              </Alert>) : null
          }
        </Form>
      </div>
    );
  }
}
