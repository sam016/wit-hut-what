import { BaseModel } from "./BaseModel";

export interface PerformanceReviewModel extends BaseModel {
  employee: BaseModel;
  organization: BaseModel;
  createdAt: Date;
}

export namespace PerformanceReviewModel {
}
