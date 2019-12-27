import { Dispatch } from "redux";
import { Employees as EmployeesActions } from "../actions/employees.actions";
import { PerformanceReviews as PerformanceReviewsActions } from "../actions/performanceReviews.actions";
import { Feedbacks as FeedbacksActions } from "../actions/feedbacks.action";
import { GET, POST } from "./fetch";
import { EmployeeModel } from "app/models";
import { RootState } from "app/reducers";

export const getAllEmployees: getAllEmployeesFunc = (orgId: number) => ((dispatch: Dispatch, getState: () => RootState) => {
  dispatch(EmployeesActions.getAllRequest({ organizationId: orgId }));

  const url = EmployeesActions.Urls.getAll.replace('{orgId}', orgId.toString());

  GET<Array<EmployeeModel>>({ url })
    .then(employees => {
      dispatch(EmployeesActions.getAllSuccess(employees));

      const mapEmployees = getState().employees.map;
      dispatch(PerformanceReviewsActions.updateEmployeeNamesRequest(mapEmployees));
      dispatch(FeedbacksActions.updateEmployeeNamesRequest(mapEmployees));
    })
    .catch(error => {
      dispatch(EmployeesActions.getAllError(error));
    });
});

export const getEmployeeById: getEmployeeByIdFunc = (orgId: number, empId: number) => ((dispatch: Dispatch) => {
  dispatch(EmployeesActions.getByIdRequest({ organizationId: orgId, id: empId }));

  const url = EmployeesActions.Urls.getById
    .replace('{orgId}', orgId.toString())
    .replace('{empId}', empId.toString());

  GET<EmployeeModel>({ url })
    .then(employee => {
      dispatch(EmployeesActions.getByIdSuccess(employee));
    })
    .catch(error => {
      dispatch(EmployeesActions.getByIdError(error));
    });
});

export const createEmployee: createEmployeeFunc = (orgId: number, name: string, email: string, password: string) => ((dispatch: Dispatch) => {
  dispatch(EmployeesActions.createRequest({
    organizationId: orgId,
    name: name,
    email: email,
    password: password,
  }));

  const url = EmployeesActions.Urls.create
    .replace('{orgId}', orgId.toString());

  const employee = {
    name,
    email,
    password,
  };

  POST<EmployeeModel>({ url, body: employee })
    .then(employee => {
      dispatch(EmployeesActions.createSuccess(employee));
    })
    .catch(error => {
      dispatch(EmployeesActions.createError(error));
    });
});

export type getAllEmployeesFunc = (orgId: number) => void;
export type getEmployeeByIdFunc = (orgId: number, empId: number) => void;
export type createEmployeeFunc = (orgId: number, name: string, email: string, password: string) => void;
