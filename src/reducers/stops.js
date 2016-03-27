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

/**
 * A reducer that updates the selected stop. The action payload should be an
 * object with following form:
 *   { label: "Stop Name", value: "Stop ID" }
 *
 * @param state {Immutable.Map} - The stops state object.
 * @param action {Object} - Flux standard action.
 *
 * @return {Immutable.Map} - The updated state.
 */
const stopSelected = (state = initialState, action) =>
  state.set('selectedStop', new Immutable.Map(action.payload));

const stopsReducer = handleActions({
  [LOAD_STOPS]: loadStops,
  [RECEIVE_STOPS]: receiveStops,
  [STOP_SELECTED]: stopSelected,
}, initialState);

export default stopsReducer;
