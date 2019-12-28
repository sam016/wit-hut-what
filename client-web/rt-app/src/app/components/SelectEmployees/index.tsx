import * as React from 'react';
import { EmployeeModel } from 'app/models';

export namespace SelectEmployees {
  export interface Props {
    items: Array<EmployeeModel>;
    disabled?: boolean;
    selected?: EmployeeModel;
    onSelect: (item: EmployeeModel) => void;
  }

  export interface State {
    disabled: boolean;
    selectedId: number;
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
      selectedId: 0,
    };
  }

  componentWillReceiveProps(props: SelectEmployees.Props) {
    const { disabled } = this.props;
    if (disabled != props.disabled) {
      this.setState({ disabled: (props.disabled || false) });
    }
    if (props.items != this.props.items) {
      if (!props.items.length) {
        this.setState({ selectedId: 0 });
      } else if (props.items.findIndex(item => item.id === this.state.selectedId) < 0) {
        this.selectItem(props.items[0]);
      }
    }
  }

  handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { items } = this.props;
    event.preventDefault();
    const selectedId = parseInt(event.target.value);
    this.selectItem(items.find(item => item.id === selectedId));
  }

  selectItem(item?: EmployeeModel) {
    if (!item) {
      return;
    }
    this.props.onSelect(item);
    this.setState({ selectedId: item.id });
  }

  render() {
    const { disabled, items } = this.props;

    return (
      <select className="custom-select select-employees"
        value={this.state.selectedId}
        onChange={this.handleSelectChange.bind(this)}
        disabled={disabled}
      >
        {items.map((employee) => (<option key={employee.id} value={employee.id}>{employee.name}</option>))}
      </select>
    );
  }
}
