import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import { DISMISS_ERROR } from '../actions';

const error = (state = null, action) => {
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
});

export default rootReducer;
