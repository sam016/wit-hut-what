import { BaseModel } from "./BaseModel";

export interface FeedbackModel extends BaseModel {
  forEmployeeId: number;
  forEmployeeName: string;
  fromEmployeeId: number;
  fromEmployeeName: string;
  performanceReviewId: number;
  performanceReviewName: string;
  organizationId: number;
  organizationName: string;
  comment: string;
  rating: FeedbackModel.Rating;
}

export namespace FeedbackModel {
  export enum Rating {
    RATING_1 = 1,
    RATING_2 = 2,
    RATING_3 = 3,
    RATING_4 = 4,
    RATING_5 = 5,
  }
}
