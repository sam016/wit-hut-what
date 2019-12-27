import { combineReducers } from 'redux';
import { RootState } from './state';
import { todoReducer } from './todos';
import { authReducer } from './auth.reducer';
import { performanceReviewReducer } from './performanceReview.reducer';
import { employeeReducer } from './employee.reducer';
import { feedbackReducer } from './feedback.reducer';

export { RootState };

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
  todos: todoReducer as any,
  auth: authReducer as any,
  performanceReviews: performanceReviewReducer as any,
  employees: employeeReducer as any,
  feedbacks: feedbackReducer as any,
});
