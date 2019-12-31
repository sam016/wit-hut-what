import { Dispatch } from "redux";
import { Feedbacks as FeedbacksActions } from "../actions/feedbacks.action";
import { GET, PUT } from "./fetch";
import { FeedbackModel, PerformanceReviewModel } from "app/models";
import { RootState } from "app/reducers";

export const getAllFeedbacks: getAllFeedbacksFunc
  = (performanceReview: PerformanceReviewModel) => ((dispatch: Dispatch, getState: () => RootState) => {
    const { organizationId, employeeId, id: performanceReviewId } = performanceReview;

    dispatch(FeedbacksActions.getAllRequest({
      organizationId: organizationId,
      forEmployeeId: employeeId,
      performanceReviewId: performanceReviewId,
    }));

    performanceReview.isLoadingFeedbacks = true;

    const url = FeedbacksActions.Urls.getAll
      .replace('{orgId}', organizationId.toString())
      .replace('{empId}', employeeId.toString())
      .replace('{performanceReviewId}', performanceReviewId.toString());

    GET<Array<FeedbackModel>>({ url })
      .then(feedbacks => {
        const mapEmps = getState().employees.map;
        for (var feedback of feedbacks) {
          feedback.forEmployeeName = mapEmps[feedback.forEmployeeId] && mapEmps[feedback.forEmployeeId].name;
          feedback.fromEmployeeName = mapEmps[feedback.fromEmployeeId] && mapEmps[feedback.fromEmployeeId].name;
        }

        performanceReview.isLoadingFeedbacks = false;
        performanceReview.feedbacks = feedbacks;
        dispatch(FeedbacksActions.getAllSuccess(feedbacks));
      })
      .catch(error => {
        performanceReview.isLoadingFeedbacks = false;
        dispatch(FeedbacksActions.getAllError(error));
      });
  });

export const updateFeedback: updateFeedbackFunc
  = (feedback: FeedbackModel) => ((dispatch: Dispatch, getState: () => RootState) => {

    dispatch(FeedbacksActions.updateRequest(feedback));

    const url = FeedbacksActions.Urls.update
      .replace('{orgId}', feedback.organizationId.toString())
      .replace('{empId}', feedback.forEmployeeId.toString())
      .replace('{performanceReviewId}', feedback.performanceReviewId.toString())
      .replace('{id}', feedback.id.toString());

    PUT<Array<FeedbackModel>>({
      url, body: {
        ...feedback,
        rating: +(feedback.rating || 1),
      }
    })
      .then(result => {
        dispatch(FeedbacksActions.updateSuccess(feedback));
      })
      .catch(error => {
        dispatch(FeedbacksActions.updateError(error));
      });
  });

export type getAllFeedbacksFunc = (performanceReview: PerformanceReviewModel) => void;
export type updateFeedbackFunc = (feedback: FeedbackModel) => void;
