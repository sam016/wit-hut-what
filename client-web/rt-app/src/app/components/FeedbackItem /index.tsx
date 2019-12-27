import * as React from 'react';
import { FeedbackModel } from 'app/models';
import './style.scss'

export namespace FeedbackItem {
  export interface Props {
    item: FeedbackModel,
    isSelected: boolean;
    onSelect?: React.MouseEventHandler<HTMLElement>;
  }
}

export class FeedbackItem extends React.Component<FeedbackItem.Props> {
  static defaultProps: Partial<FeedbackItem.Props> = {
    item: {
      fromEmployeeId: 0,
      fromEmployeeName: '',
      forEmployeeId: 0,
      forEmployeeName: '',
      performanceReviewId: 0,
      performanceReviewName: '',
      organizationId: 0,
      organizationName: '',
      id: 0,
      name: '',
      comment: '',
      rating: 0,
    },
    isSelected: false,
  };

  constructor(props: FeedbackItem.Props, context?: any) {
    super(props, context);
  }

  render() {
    const { item, isSelected, onSelect } = this.props;

    return (
      <div className={'feedback-item ' + (isSelected ? 'selected' : '')} onClick={onSelect} >
        <div className="header">
          <div className="review-title">
            {item.name
              ? <span>{item.name || 'my-title'}</span>
              : <span className={'pending'}>Pending</span>}
          </div>
          <div className="review-from-emp">
            <span className="cursive">by</span>
            <span>{item.fromEmployeeName}</span>
          </div>
        </div>
        <div className="review-comment">
          {item.comment
              ? <span>{item.comment}</span>
              : <span className={'pending'}>No comments</span>}
        </div>
      </div>
    );
  }
}
