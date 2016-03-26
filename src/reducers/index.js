import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import stops from './stops';
import { DISMISS_ERROR } from '../actions';

const error = (_, action) => {
  if (action.type === DISMISS_ERROR) {
    return null;
  } else if (action.error) {
    return action.payload;
  }

  return null;
};

const rootReducer = combineReducers({
  error,
  routing,
  stops,
});

export default rootReducer;
