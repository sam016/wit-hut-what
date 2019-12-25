import { Dispatch } from "redux";
import { PerformanceReviews as PerformanceReviewsActions } from "../actions/performanceReview";
import { GET, POST } from "./fetch";
import { PerformanceReviewModel } from "app/models";

export const getAllPerformanceReviews = (orgId: number, empId: number) => ((dispatch: Dispatch) => {
  dispatch(PerformanceReviewsActions.getAllRequest({
    organizationId: orgId,
    employeeId: empId,
  }));

  const url = PerformanceReviewsActions.Urls.getAll
    .replace('{orgId}', orgId.toString())
    .replace('{empId}', empId.toString());

  GET<Array<PerformanceReviewModel>>({ url })
    .then(performanceReviews => {
      dispatch(PerformanceReviewsActions.getAllSuccess(performanceReviews));
    })
    .catch(error => {
      dispatch(PerformanceReviewsActions.getAllError(error));
    });
});

export const getPerformanceReviewById = (orgId: number, empId: number, id: number) => ((dispatch: Dispatch) => {
  dispatch(PerformanceReviewsActions.getByIdRequest({
    organizationId: orgId,
    employeeId: empId,
    id: id,
  }));

  const url = PerformanceReviewsActions.Urls.getById
    .replace('{orgId}', orgId.toString())
    .replace('{empId}', empId.toString())
    .replace('{id}', id.toString());

  GET<PerformanceReviewModel>({ url })
    .then(performanceReview => {
      dispatch(PerformanceReviewsActions.getByIdSuccess(performanceReview));
    })
    .catch(error => {
      dispatch(PerformanceReviewsActions.getByIdError(error));
    });
});

export const createPerformanceReview: createPerformanceReviewFunc = (performanceReview: PerformanceReviewModel) => ((dispatch: Dispatch) => {
  const req = {
    organizationId: performanceReview.organization.id,
    employeeId: performanceReview.employee.id,
    name: performanceReview.name,
  };
  dispatch(PerformanceReviewsActions.createRequest(req));

  const url = PerformanceReviewsActions.Urls.create
    .replace('{orgId}', req.organizationId.toString())
    .replace('{empId}', req.employeeId.toString());

  POST<PerformanceReviewModel>({ url, body: req })
    .then(performanceReview => {
      dispatch(PerformanceReviewsActions.createSuccess(performanceReview));
    })
    .catch(error => {
      dispatch(PerformanceReviewsActions.createError(error));
    });
});

export type createPerformanceReviewFunc = (performanceReview: PerformanceReviewModel) => void;
