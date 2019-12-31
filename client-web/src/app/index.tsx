import * as React from 'react';
import { hot } from 'react-hot-loader';
import { App as MainApp } from './containers/App';
import './index.scss';

export const App = hot(module)(() => (
  <MainApp />
));
