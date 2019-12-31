import * as React from 'react';
import { PerformanceReviewModel } from 'app/models';
import { PerformanceReviewItem } from '../PerformanceReviewItem';

export namespace PerformanceReviewList {
  export interface Props {
    items: Array<PerformanceReviewModel>,
    selectedItem: PerformanceReviewModel | null;
    isLoading: boolean;
    onSelect?: (event: React.MouseEvent<HTMLElement>, item: PerformanceReviewModel) => void;
  }
}

export class PerformanceReviewList extends React.Component<PerformanceReviewList.Props> {
  static defaultProps: Partial<PerformanceReviewList.Props> = {
    items: [],
    selectedItem: null,
    isLoading: false,
  };

  handleItemSelection(item: PerformanceReviewModel, event: React.MouseEvent<HTMLElement>) {
    const { onSelect } = this.props;
    if (!onSelect) {
      return;
    }
    onSelect(event, item);
  }

  render() {
    const { items, isLoading, selectedItem } = this.props;

    if (isLoading) {
      return ("Loading...");
    }

    if (!items.length && !isLoading) {
      return (<p className="msg-on-wall">
        No feedbacks
        </p>);
    }

    return (
      <>
        {items.map((item, index) => (
          <PerformanceReviewItem
            key={index}
            item={item}
            isSelected={item == selectedItem}
            onSelect={this.handleItemSelection.bind(this, item)} />
        ))}
      </>
    );
  }
}
