import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

import { LOAD_STOPS, RECEIVE_STOPS, STOP_SELECTED } from '../actions/stops';

const initialState = Immutable.fromJS({
  isFetching: true,
  stopData: null,
  selectedStop: null,
});

const loadStops = (state = initialState) => state.set('isFetching', true);

const receiveStops = (state = initialState, action) => {
  // Turn the Array[Stop] into Map(Stop.id -> Stop)
  const stops = action.payload.map(stop => [stop.id, Immutable.fromJS(stop)]);

  // Update the state
  return state.set('isFetching', false)
              .set('stopData', new Immutable.Map(stops));
};

const stopSelected = (state = initialState, action) =>
  state.set('selectedStop', Immutable.fromJS(action.payload));

const stopsReducer = handleActions({
  [LOAD_STOPS]: loadStops,
  [RECEIVE_STOPS]: receiveStops,
  [STOP_SELECTED]: stopSelected,
}, initialState);

export default stopsReducer;
