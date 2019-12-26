import { Dispatch } from "redux";
import { Employees as EmployeesActions } from "../actions/employee";
import { GET, POST } from "./fetch";
import { EmployeeModel } from "app/models";

export const getAllEmployees: getAllEmployeesFunc = (orgId: number) => ((dispatch: Dispatch) => {
  dispatch(EmployeesActions.getAllRequest({ organizationId: orgId }));

  const url = EmployeesActions.Urls.getAll.replace('{orgId}', orgId.toString());

  GET<Array<EmployeeModel>>({ url })
    .then(employees => {
      dispatch(EmployeesActions.getAllSuccess(employees));
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
