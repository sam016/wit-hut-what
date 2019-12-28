import { TodoModel, AuthModel, PerformanceReviewModel, EmployeeModel, FeedbackModel } from 'app/models';

export interface RootState {
  todos: RootState.TodoState;
  auth: RootState.AuthState;
  performanceReviews: RootState.PerformanceReviewState;
  employees: RootState.EmployeeState;
  feedbacks: RootState.FeedbackState;
  router?: any;
}

export namespace RootState {
  export type TodoState = TodoModel[];

  interface AjaxModelState<T> {
    data: T;
    isLoading: boolean;
    // counterLoading: number;
    error: string | null;
  }

  interface AjaxModelListState<T> extends AjaxModelState<Array<T>> {
    map: Record<number, T>;
  }

  export interface AuthState extends AjaxModelState<AuthModel | null> {
    email: string | null;
    password: string | null;
    isAdmin: boolean;
  };

  export interface PerformanceReviewState extends AjaxModelListState<PerformanceReviewModel> {
  };

  export interface EmployeeState extends AjaxModelListState<EmployeeModel> {
  };

  export interface FeedbackState extends AjaxModelListState<FeedbackModel> {
  };
}
