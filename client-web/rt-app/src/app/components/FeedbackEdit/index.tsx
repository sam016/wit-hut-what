import * as React from 'react';
import { FeedbackModel } from 'app/models';
import './style.scss'
import { Button, Form, Col } from 'react-bootstrap';

export namespace FeedbackEdit {
  export interface Props {
    item: FeedbackModel,
    disabled: boolean,
    onSave: (item: FeedbackModel) => void;
  }
  export interface State {
    title: string;
    comment: string;
    rating: FeedbackModel.Rating;
    disabled: boolean;
  }
}

export class FeedbackEdit extends React.Component<FeedbackEdit.Props, FeedbackEdit.State> {
  static defaultProps: Partial<FeedbackEdit.Props> = {
    item: {
      id: 0,
      name: '',
      comment: '',
      rating: 0,
      fromEmployeeId: 0,
      fromEmployeeName: '',
      forEmployeeId: 0,
      forEmployeeName: '',
      performanceReviewId: 0,
      performanceReviewName: '',
      organizationId: 0,
      organizationName: '',
    },
  };

  constructor(props: FeedbackEdit.Props, context?: any) {
    super(props, context);

    this.state = {
      title: props.item.name || '',
      comment: props.item.comment || '',
      rating: props.item.rating || 1,
      disabled: false,
    }
  }

  componentWillReceiveProps(props: FeedbackEdit.Props) {
    if (props.disabled !== this.state.disabled) {
      this.setState({ disabled: props.disabled });
    }
  }

  handleFormChange(propKey: string, event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) {
    if (['comment', 'title', 'rating'].indexOf(propKey) < 0) {
      return;
    }

    // console.log('--newstate', {
    //   [propKey]: (event.target as any).value
    // });

    this.setState({
      [propKey]: (event.target as any).value
    } as Pick<FeedbackEdit.State, keyof FeedbackEdit.State>);
  }

  handleOnSave() {
    const { comment, title, rating } = this.state;
    this.props.onSave({
      ...this.props.item,
      name: title,
      comment,
      rating,
    });
  }

  handleStarClick(nextValue: number, prevValue: number, name: string) {
    console.log('--nextValue', nextValue, '--prevValue', prevValue, '--name', name);
  }

  render() {
    const { disabled, title, comment, rating } = this.state;

    return (
      <Form className="feedback-item-edit" >
        <Form.Row>
          <div className="header h6">Please provide your feedback</div>
        </Form.Row>
        <Form.Row>
          <Col xs={12} sm={6} className="mb-3">
            <Form.Control placeholder="Title" value={title} disabled={disabled}
              onChange={this.handleFormChange.bind(this, 'title')} />
          </Col>
          <Col>
            <Form.Row className="mb-3">
              <Col>
                <select
                  className="custom-select"
                  value={rating} disabled={disabled}
                  onChange={this.handleFormChange.bind(this, 'rating')}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </Col>
              <Col>
                <Button disabled={disabled} onClick={this.handleOnSave.bind(this)}>Save</Button>
              </Col>

            </Form.Row>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Control as="textarea" rows="3" placeholder="Comment" disabled={disabled}
              value={comment} onChange={this.handleFormChange.bind(this, 'comment')} />
          </Col>
        </Form.Row>
      </Form>
    );
  }
}
