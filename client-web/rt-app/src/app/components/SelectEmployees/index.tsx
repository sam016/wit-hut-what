import * as React from 'react';
import { EmployeeModel } from 'app/models';

export namespace SelectEmployees {
  export interface Props {
    items: Array<EmployeeModel>;
    disabled?: boolean;
    selected?: EmployeeModel;
    onSelect: (event: React.ChangeEvent<HTMLElement>, item: EmployeeModel) => void;
  }

  export interface State {
    disabled: boolean;
  }
}

export class SelectEmployees extends React.Component<SelectEmployees.Props, SelectEmployees.State> {
  static defaultProps: Partial<SelectEmployees.Props> = {
    items: [],
  };

  constructor(props: SelectEmployees.Props, context?: any) {
    super(props, context);

    this.state = {
      disabled: props.disabled || false,
    };
  }

  componentWillReceiveProps(props: SelectEmployees.Props) {
    const { disabled } = this.props;
    if (disabled != props.disabled) {
      this.setState({ disabled: (props.disabled || false) });
    }
  }

  handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { onSelect, items } = this.props;
    event.preventDefault();
    const selectedId = parseInt(event.target.value);
    var item = items.find(item => item.id === selectedId);
    if (item) {
      onSelect(event, item);
    }
  }

  render() {
    const { disabled, items } = this.props;

    return (
      <select className="custom-select select-employees"
        onChange={this.handleSelectChange.bind(this)}
        disabled={disabled}
      >
        {items.map((employee, index) => (<option key={employee.id} value={employee.id}>{employee.name}</option>))}
      </select>
    );
  }
}
