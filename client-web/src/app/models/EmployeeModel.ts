import { BaseModel } from "./BaseModel";

export interface EmployeeModel extends BaseModel {
  organizationId: number;
  email: string;
  password: string;
}

export namespace EmployeeModel {
}
