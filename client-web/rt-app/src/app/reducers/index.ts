import { combineReducers } from 'redux';
import { RootState } from './state';
import { todoReducer } from './todos';
import { authReducer } from './auth';
import { performanceReviewReducer } from './performanceReview';
import { employeeReducer } from './employee';
import { feedbackReducer } from './feedback';

export { RootState };

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
  todos: todoReducer as any,
  auth: authReducer as any,
  performanceReviews: performanceReviewReducer as any,
  employees: employeeReducer as any,
  feedbackState: feedbackReducer as any,
});
