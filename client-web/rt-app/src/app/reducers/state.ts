import { TodoModel, AuthModel, PerformanceReviewModel, EmployeeModel, FeedbackModel } from 'app/models';

export interface RootState {
  todos: RootState.TodoState;
  auth: RootState.AuthState;
  performanceReviews: RootState.PerformanceReviewState;
  employees: RootState.EmployeeState;
  feedbackState: RootState.FeedbackState;
  router?: any;
}

export namespace RootState {
  export type TodoState = TodoModel[];

  interface AjaxModelState<T> {
    data: T;
    isLoading: boolean;
    error: string | null;
  }

  export interface AuthState extends AjaxModelState<AuthModel | null> {
    email: string | null;
    password: string | null;
    isAdmin: boolean;
  };

  export interface PerformanceReviewState extends AjaxModelState<Array<PerformanceReviewModel>> {
    selected?: PerformanceReviewModel;
  };

  export interface EmployeeState extends AjaxModelState<Array<EmployeeModel>> {
  };

  export interface FeedbackState extends AjaxModelState<Array<FeedbackModel>> {
    map: Record<number, FeedbackModel>
  };
}
