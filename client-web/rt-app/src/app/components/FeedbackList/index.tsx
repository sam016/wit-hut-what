import * as React from 'react';
import { FeedbackModel } from 'app/models';
import { FeedbackItem } from '../FeedbackItem ';

export namespace FeedbackList {
  export interface Props {
    items: Array<FeedbackModel>,
    selectedItem: FeedbackModel | null;
    isLoading: boolean;
    onSelect?: (event: React.MouseEvent<HTMLElement>, item: FeedbackModel) => void;
  }
}

export class FeedbackList extends React.Component<FeedbackList.Props> {
  static defaultProps: Partial<FeedbackList.Props> = {
    items: [],
    selectedItem: null,
    isLoading: false,
  };

  handleItemSelection(item: FeedbackModel, event: React.MouseEvent<HTMLElement>) {
    const { onSelect } = this.props;
    if (!onSelect) {
      return;
    }
    onSelect(event, item);
  }

  render() {
    const { items, isLoading, selectedItem } = this.props;

    if (!items.length && !isLoading) {
      return (<p className="msg-on-wall">
        No feedbacks
        </p>);
    }

    return (
      <>
        {items.map((item, index) => (
          <FeedbackItem
            key={index}
            item={item}
            isSelected={item == selectedItem}
            onSelect={this.handleItemSelection.bind(this, item)} />
        ))}
        {
          isLoading
            ? (<p className="msg-on-wall">
              Loading... </p>)
            : null
        }
      </>
    );
  }
}
