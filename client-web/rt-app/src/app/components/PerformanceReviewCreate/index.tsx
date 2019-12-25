import * as React from 'react';
import { PerformanceReviewModel, EmployeeModel } from 'app/models';
import { Row, Form, Button, Alert } from 'react-bootstrap';

export namespace PerformanceReviewCreate {
  export interface Props {
    item: PerformanceReviewModel,
    error?: string,
    disabled?: boolean,
    onSave: React.MouseEventHandler<HTMLElement>;
    employees: Array<EmployeeModel>;
  }

  export interface State {
    disabled: boolean,
  }
}

export class PerformanceReviewCreate extends React.Component<PerformanceReviewCreate.Props, PerformanceReviewCreate.State> {
  static defaultProps: Partial<PerformanceReviewCreate.Props> = {
    item: {
      employee: {
        id: 0,
        name: '',
      },
      id: 0,
      name: '',
      organization: {
        id: 0,
        name: '',
      },
      createdAt: new Date(0),
    },
    employees: [],
  };

  constructor(props: PerformanceReviewCreate.Props, context?: any) {
    super(props, context);

    this.setState({
      disabled: props.disabled || false,
    })
  }

  componentWillReceiveProps(props: PerformanceReviewCreate.Props) {
    const { disabled } = this.props;
    if (disabled != props.disabled) {
      this.setState({ disabled: (props.disabled || false) });
    }
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {

  }

  handleFormSubmit(event: React.FormEvent) {

  }

  render() {
    const { item, disabled, error, employees, onSave } = this.props;

    return (
      <Row className={'performance-review-item performance-review-create'} >
        <h4>{item.name} </h4>
        <Form>
          <Form.Group controlId="formEmployee">
            <Form.Label>Employee</Form.Label>
            <select
              onChange={this.handleInputChange.bind(this)}
              disabled={disabled}>
              {employees.map((employee, index) => (<option key={employee.id} value={employee.id}>{employee.name}</option>))}
            </select>
          </Form.Group>

          <Form.Group controlId="formPerformanceReviewTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Performance Review Title" onChange={this.handleInputChange.bind(this)}
              disabled={disabled} />
          </Form.Group>

          <Button variant="primary" type="submit"
            onClick={onSave.bind(this)}
            disabled={disabled}>
            Submit
          </Button>
          {
            error ?
              (<Alert variant='danger'>
                {error}
              </Alert>) : null
          }
        </Form>
      </Row>
    );
  }
}
