import * as React from 'react';
import { PerformanceReviewModel } from 'app/models';
import './style.scss'

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
    isSelected: false,
  };

  constructor(props: PerformanceReviewItem.Props, context?: any) {
    super(props, context);
  }

  render() {
    const { item, isSelected, onSelect } = this.props;

    return (
      <div className={'performance-review-item ' + (isSelected ? 'selected' : '')} onClick={onSelect} >
        <div className="review-title">
          <span>{item.name}</span>
        </div>
        <div className="review-emp">{item.employeeName} </div>
      </div>
    );
  }
}
