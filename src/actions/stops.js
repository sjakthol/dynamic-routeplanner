import { createAction } from 'redux-actions';

export const LOAD_STOPS = 'LOAD_STOPS';
export const loadStops = createAction(LOAD_STOPS);

export const RECEIVE_STOPS = 'RECEIVE_STOPS';
export const receiveStops = createAction(RECEIVE_STOPS);

export const STOP_SELECTED = 'STOP_SELECTED';
export const stopSelected = createAction(STOP_SELECTED);

export const LOAD_STOP_TIMES = 'LOAD_STOP_TIMES';
export const loadStopTimes = createAction(LOAD_STOP_TIMES);

export const RECEIVE_STOP_TIMES = 'RECEIVE_STOP_TIMES';
export const receiveStopTimes = createAction(RECEIVE_STOP_TIMES);

const STOP_LIST_KEY = 'STOP_LIST';
const STOP_LIST_CACHE_MS = 24 * 60 * 60 * 1000;
const STOP_TIME_CACHE_MS = 30000;
const STOP_LIST_API = 'http://beta.digitransit.fi/otp/routers/hsl/index/stops';
const STOPTIMES_API_TMPL = 'http://beta.digitransit.fi/otp/routers/hsl/index/stops/:STOP_ID/stoptimes';

function shouldFetchStops(state) {
  return !state.stops.isFetching && !state.stops.stopData;
}

/**
 * Retrieves the stop data from localStorage if valid data is found.
 *
 * @return object the stored stop array
 */
function getStopsFromLocalStorage() {
  const data = localStorage.getItem(STOP_LIST_KEY);
  if (!data) {
    return null;
  }

  try {
    const stopData = JSON.parse(data);
    if (Date.now() - stopData.timestamp < STOP_LIST_CACHE_MS) {
      // Data is still valid. Return it.
      return stopData.data;
    }

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Stores the stop list to localStorage.
 *
 * @param Array stops - The stop list returned from Digitransit API.
 */
function storeStopsToLocalStorage(stops) {
  const data = JSON.stringify({
    timestamp: Date.now(),
    data: stops,
  });

  localStorage.setItem(STOP_LIST_KEY, data);
}

const parseResponse = response => {
  if (response.ok) {
    return response.json();
  }

  return response.text().then(body => {
    const { status, url, statusText } = response;
    throw new Error(`Failed to fetch '${url}' (${status} ${statusText}): ${body}`);
  });
};

/**
 * Retrieves the stop list if needed. If the list is already part of the state,
 * nothing happens. If the data is found from localStorage, we use that one.
 * Otherwise we retrieve it from the network.
 *
 * @return Promise a promise that is resolved once the data has been retrieved.
 */
export function fetchStopsIfNeeded() {
  return (dispatch, getState) => {
    if (!shouldFetchStops(getState())) {
      // Nothing to do.
      return Promise.resolve();
    }

    // Check if the data is already cached in localStorage
    const cachedData = getStopsFromLocalStorage();
    if (cachedData) {
      return dispatch(receiveStops(cachedData));
    }

    // Notify that we're about to load the stops.
    dispatch(loadStops());

    return fetch(STOP_LIST_API)
      .then(parseResponse)
      .then(data => {
        storeStopsToLocalStorage(data);
        dispatch(receiveStops(data));
      }, error => dispatch(receiveStops(error)));
  };
}

/**
 * Check if stoptimes for the given stop needs to be refreshed. It is refreshed
 * if:
 *  - there's not time for the stop at all
 *  - the old data has expired (see STOP_TIME_CACHE_MS)
 *
 * @param state {Immutable.Map} - The state tree.
 * @param stopId {String} - The ID for the stop.
 *
 * @return {Boolean} true if refresh is needed, false otherwise.
 */
function shouldFetchStopTimes(state, stopId) {
  // #1. Check if the fetch is in progress (also fails if there's no data)
  const isFetching = state.stops.getIn(['stopTimes', stopId, 'isFetching']);
  if (isFetching === true) {
    // fetch already in progress; don't fetch
    return false;
  }

  if (isFetching === undefined) {
    // no data for this stop; fetch.
    return true;
  }

  // #2. Check if the data has expired.
  const timestamp = state.stops.getIn(['stopTimes', stopId, 'timestamp']);
  return (Date.now() - timestamp) > STOP_TIME_CACHE_MS;
}

/**
 * Fetches stop times for the given stop.
 *
 * @param stopId {String} - The ID of the stop to fetch.
 *
 * @return {Function} A thunk that can be dispatched.
 */
export function fetchStopTimesIfNeeded(stopId) {
  return (dispatch, getState) => {
    if (!shouldFetchStopTimes(getState(), stopId)) {
      return Promise.resolve();
    }

    // Notify that we are loading stop times.
    dispatch(loadStopTimes(stopId));

    const url = STOPTIMES_API_TMPL.replace(':STOP_ID', stopId);
    return fetch(url)
      .then(parseResponse)
      .then(patterns => {
        const payload = { stopId, patterns };
        dispatch(receiveStopTimes(payload));
      }, error => dispatch(receiveStopTimes(error)));
  };
}
