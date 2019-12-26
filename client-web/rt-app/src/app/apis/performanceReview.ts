import { Dispatch } from "redux";
import { PerformanceReviews as PerformanceReviewsActions } from "../actions/performanceReview";
import { GET, POST } from "./fetch";
import { PerformanceReviewModel } from "app/models";

export const getAllPerformanceReviewsInOrg: getAllPerformanceReviewsInOrgFunc = (orgId: number) => ((dispatch: Dispatch) => {
  dispatch(PerformanceReviewsActions.getAllInOrgRequest({
    organizationId: orgId,
  }));

  const url = PerformanceReviewsActions.Urls.getAllInOrg
    .replace('{orgId}', orgId.toString());

  GET<Array<PerformanceReviewModel>>({ url })
    .then(performanceReviews => {
      dispatch(PerformanceReviewsActions.getAllInOrgSuccess(performanceReviews));
    })
    .catch(error => {
      dispatch(PerformanceReviewsActions.getAllInOrgError(error));
    });
});

export const getAllPerformanceReviewsForEmp: getAllPerformanceReviewsForEmpFunc = (orgId: number, empId: number) => ((dispatch: Dispatch) => {
  dispatch(PerformanceReviewsActions.getAllForEmpRequest({
    organizationId: orgId,
    employeeId: empId,
  }));

  const url = PerformanceReviewsActions.Urls.getAllForEmp
    .replace('{orgId}', orgId.toString())
    .replace('{empId}', empId.toString());

  GET<Array<PerformanceReviewModel>>({ url })
    .then(performanceReviews => {
      dispatch(PerformanceReviewsActions.getAllForEmpSuccess(performanceReviews));
    })
    .catch(error => {
      dispatch(PerformanceReviewsActions.getAllForEmpError(error));
    });
});

export const getPerformanceReviewById: getByIdPerformanceReviewFunc = (orgId: number, empId: number, id: number) => ((dispatch: Dispatch) => {
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

export type getAllPerformanceReviewsInOrgFunc = (orgId: number) => void;
export type getAllPerformanceReviewsForEmpFunc = (orgId: number, empId: number) => void;
export type getAllPerformanceReviewsOfEmpFunc = (orgId: number, empId: number) => void;
export type getByIdPerformanceReviewFunc = (orgId: number, empId: number, id: number) => void;
export type createPerformanceReviewFunc = (performanceReview: PerformanceReviewModel) => void;
