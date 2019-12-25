import * as React from 'react';
import { PerformanceReviewModel } from 'app/models';
import { Row } from 'react-bootstrap';

export namespace PerformanceReviewItem {
  export interface Props {
    item: PerformanceReviewModel,
    isSelected: boolean;
    onSelect?: React.MouseEventHandler<HTMLElement>;
  }
}

export class PerformanceReviewItem extends React.Component<PerformanceReviewItem.Props> {
  static defaultProps: Partial<PerformanceReviewItem.Props> = {
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
    isSelected: false,
  };

  constructor(props: PerformanceReviewItem.Props, context?: any) {
    super(props, context);
  }

  render() {
    const { item, isSelected, onSelect } = this.props;

    return (
      <Row className={'performance-review-item ' + (isSelected ? 'selected' : '')} onClick={onSelect} >
        <h4>{item.name} </h4>
        <div> </div>
      </Row>
    );
  }
}
