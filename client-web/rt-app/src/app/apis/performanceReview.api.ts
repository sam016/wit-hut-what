import { Dispatch } from "redux";
import { PerformanceReviews as PerformanceReviewsActions } from "../actions/performanceReviews.actions";
import { Feedbacks as FeedbacksActions } from "../actions/feedbacks.action";
import { GET, POST } from "./fetch";
import { PerformanceReviewModel, FeedbackModel } from "app/models";
import { RootState } from "app/reducers";

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

export const getAllPerformanceReviewsForEmp: getAllPerformanceReviewsForEmpFunc
  = (orgId: number, empId: number) => ((dispatch: Dispatch, getState: () => RootState) => {
    dispatch(PerformanceReviewsActions.getAllForEmpRequest({
      organizationId: orgId,
      employeeId: empId,
    }));

    const url = PerformanceReviewsActions.Urls.getAllForEmp
      .replace('{orgId}', orgId.toString())
      .replace('{empId}', empId.toString());

    GET<Array<PerformanceReviewModel>>({ url })
      .then(performanceReviews => {
        const mapEmployees = getState().employees.map;
        for (const pr of performanceReviews) {
          pr.employeeName = mapEmployees[pr.employeeId] && mapEmployees[pr.employeeId].name;
        }

        dispatch(PerformanceReviewsActions.getAllForEmpSuccess(performanceReviews));
      })
      .catch(error => {
        dispatch(PerformanceReviewsActions.getAllForEmpError(error));
      });
  });

export const getPerformanceReviewById: getByIdPerformanceReviewFunc
  = (orgId: number, empId: number, id: number) => ((dispatch: Dispatch) => {
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

export const createPerformanceReview: createPerformanceReviewFunc
  = (performanceReview: PerformanceReviewModel) => ((dispatch: Dispatch, getState: () => RootState) => {
    const req = {
      organizationId: performanceReview.organizationId,
      employeeId: performanceReview.employeeId,
      name: performanceReview.name,
    };
    dispatch(PerformanceReviewsActions.createRequest(req));

    const url = PerformanceReviewsActions.Urls.create
      .replace('{orgId}', req.organizationId.toString())
      .replace('{empId}', req.employeeId.toString());

    POST<PerformanceReviewModel>({ url, body: req })
      .then(performanceReview => {
        const mapEmployees = getState().employees.map;
        performanceReview.employeeName = mapEmployees[performanceReview.employeeId]
          && mapEmployees[performanceReview.employeeId].name;

        dispatch(PerformanceReviewsActions.createSuccess(performanceReview));
      })
      .catch(error => {
        dispatch(PerformanceReviewsActions.createError(error));
      });
  });

export const permitEmployeeAccess: permitEmployeeAccessFunc
  = (orgId: number, empId: number, performanceReview: PerformanceReviewModel) =>
    ((dispatch: Dispatch, getState: () => RootState) => {
      const req = {
        organizationId: orgId,
        employeeId: empId,
        id: performanceReview.id,
      };

      dispatch(PerformanceReviewsActions.permitEmployeeAccessRequest(req));
      dispatch(FeedbacksActions.createRequest({
        organizationId: orgId,
        comment: '',
        performanceReviewId: performanceReview.id,
        rating: FeedbackModel.Rating.RATING_1,
      }));

      const url = PerformanceReviewsActions.Urls.permitEmployeeAccess
        .replace('{orgId}', req.organizationId.toString())
        .replace('{empId}', req.employeeId.toString())
        .replace('{id}', req.id.toString());

      POST<FeedbackModel>({ url })
        .then(feedback => {
          const mapEmps = getState().employees.map;

          feedback.forEmployeeName = mapEmps[feedback.forEmployeeId] && mapEmps[feedback.forEmployeeId].name;
          feedback.fromEmployeeName = mapEmps[feedback.fromEmployeeId] && mapEmps[feedback.fromEmployeeId].name;

          dispatch(FeedbacksActions.createSuccess(feedback));
          dispatch(PerformanceReviewsActions.permitEmployeeAccessSuccess(feedback));
        })
        .catch(error => {
          dispatch(FeedbacksActions.createError(error));
          dispatch(PerformanceReviewsActions.permitEmployeeAccessError(req));
        });
    });

export const revokeEmployeeAccess: revokeEmployeeAccessFunc
  = (orgId: number, empId: number, performanceReview: PerformanceReviewModel) =>
    ((dispatch: Dispatch) => {
      const req = {
        organizationId: orgId,
        employeeId: empId,
        id: performanceReview.id,
      };
      dispatch(PerformanceReviewsActions.revokeEmployeeAccessRequest(req));

      const url = PerformanceReviewsActions.Urls.revokeEmployeeAccess
        .replace('{orgId}', req.organizationId.toString())
        .replace('{empId}', req.employeeId.toString())
        .replace('{id}', req.employeeId.toString());

      POST<PerformanceReviewModel>({ url })
        .then(res => {
          dispatch(PerformanceReviewsActions.revokeEmployeeAccessSuccess(res));
        })
        .catch(error => {
          dispatch(PerformanceReviewsActions.revokeEmployeeAccessError(error));
        });
    });

export type getAllPerformanceReviewsInOrgFunc = (orgId: number) => void;
export type getAllPerformanceReviewsForEmpFunc = (orgId: number, empId: number) => void;
export type getAllPerformanceReviewsOfEmpFunc = (orgId: number, empId: number) => void;
export type getByIdPerformanceReviewFunc = (orgId: number, empId: number, id: number) => void;
export type createPerformanceReviewFunc = (performanceReview: PerformanceReviewModel) => void;
export type permitEmployeeAccessFunc = (orgId: number, empId: number, performanceReview: PerformanceReviewModel) => void;
export type revokeEmployeeAccessFunc = (orgId: number, empId: number, performanceReview: PerformanceReviewModel) => void;
