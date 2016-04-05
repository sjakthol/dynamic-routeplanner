import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import { persistFavoritesMiddleware } from '../middleware/persist-favorites';
import rootReducer from '../reducers';

export default initialState => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk, createLogger(), persistFavoritesMiddleware)
);
