import { createStore, applyMiddleware, Store } from 'redux';
import { History } from 'history';
// import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from '../redux/reducers';
import { IAppState } from "../types";

const loggerMiddleware = createLogger();



// export const store = createStore<IAppState>(
//   rootReducer,
//   {
//     siteName: 'Org ERMM',
//     loggedInUser: null,
//     loggingIn: false
//   },
//   applyMiddleware(
//     thunkMiddleware,
//     loggerMiddleware
//   )
// );


export default function configureStore(
  history: History,
  initialState: IAppState,
): Store<IAppState> {
  // create the composing function for our middlewares
  const composeEnhancers = composeWithDevTools({});

  // We'll create our store with the combined reducers and the initial Redux state that
  // we'll be passing from our entry point.
  return createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(
      routerMiddleware(history),
      loggerMiddleware,
    )),
  );
}
