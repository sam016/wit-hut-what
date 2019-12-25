import { BaseModel } from "./BaseModel";

export interface AuthModel extends BaseModel {
  organizationId: number;
  role: AuthModel.ROLE;
  email?: string | null;
  password?: string | null;
  token: string;
}

export namespace AuthModel {
  export enum ROLE {
    'SUPER_ADMIN' = 1,
    'ADMIN' = 2,
    'EMPLOYEE' = 3,
  };
}
