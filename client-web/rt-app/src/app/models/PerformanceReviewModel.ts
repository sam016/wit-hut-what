import { BaseModel } from "./BaseModel";
import { FeedbackModel } from "./FeedbackModel";

export interface PerformanceReviewModel extends BaseModel {
  employeeId: number;
  employeeName: string;
  organizationId: number;
  organizationName: string;
  createdAt: Date;
  permittedEmployees: Array<number>;
  isLoadingFeedbacks: boolean;
  feedbacks: Array<FeedbackModel>;
}

export namespace PerformanceReviewModel {
}
