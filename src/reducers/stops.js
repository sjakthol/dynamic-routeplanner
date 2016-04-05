import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

import { getFavoritesFromStorage } from '../middleware/persist-favorites';
import { LOAD_STOPS, RECEIVE_STOPS,
         STOP_SELECTED,
         LOAD_STOP_TIMES, RECEIVE_STOP_TIMES,
         SAVE_FAVORITE, REMOVE_FAVORITE } from '../actions/stops';

const initialState = Immutable.fromJS({
  favorites: new Immutable.Set(getFavoritesFromStorage()),
  isFetching: false,
  stopData: {},
  stopTimes: {},
  selectedStop: {},
});

/**
 * A reducer that listens to the LOAD_STOPS action and marks load to be
 * in progress.
 *
 * @param state {Immutable.Map} - The stops state object.
 *
 * @return {Immutable.Map} - The updated state Map.
 */
const loadStops = (state = initialState) => state.set('isFetching', true);

/**
 * A reducer that handles incoming stop information. The list is turned into
 * a Immutable Map keyed by the stop IDs and the isFetching flag is cleared.
 *
 * @param state {Immutable.Map} - The stops state object.
 * @param action {Object} - Flux standard action. Payload should be array of stops.
 *
 * @return {Immutable.Map} - The updated state.
 */
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

/**
 * Marks a stoptime fetch in-progress for the given stop.
 *
 * @param state {Immutable.Map} - The stops state object.
 * @param action {Object} - Flux standard action where the payload is the stop
 * id.
 *
 * @return {Immutable.Map} - The updated state.
 */
const loadingStopTimes = (state = initialState, action) =>
  state.setIn(['stopTimes', action.payload, 'isFetching'], true);

/**
 * Pushes new stoptimes of a stop to the state. The action payload should have
 * the following form
 *   { stopId: "HSL:222222", patterns: [] }
 * where patterns Array is the response from Digitraffic stoptimes API.
 *
 * @param state {Immutable.Map} - The stops state object.
 * @param action {Object} - Flux standard action.
 *
 * @return {Immutable.Map} - The updated state.
 */
const receiveStopTimes = (state = initialState, action) => {
  const data = Immutable.fromJS({
    isFetching: false,
    timestamp: Date.now(),
    patterns: action.payload.patterns,
  });

  return state.setIn(['stopTimes', action.payload.stopId], data);
};

/**
 * Adds the given stopid to the list of favorites.
 *
 * @param state {Immutable.Map} - The stops state object.
 * @param action {Object} - Flux standard action.
 *
 * @return {Immutable.Map} - The updated state.
 */
const saveFavorite = (state = initialState, action) =>
  state.set('favorites', state.get('favorites').add(action.payload));

const removeFavorite = (state = initialState, action) =>
  state.set('favorites', state.get('favorites').delete(action.payload));

const stopsReducer = handleActions({
  [LOAD_STOPS]: { next: loadStops },
  [RECEIVE_STOPS]: { next: receiveStops },
  [STOP_SELECTED]: { next: stopSelected },
  [RECEIVE_STOP_TIMES]: { next: receiveStopTimes },
  [LOAD_STOP_TIMES]: { next: loadingStopTimes },
  [SAVE_FAVORITE]: { next: saveFavorite },
  [REMOVE_FAVORITE]: { next: removeFavorite },
}, initialState);

export default stopsReducer;
