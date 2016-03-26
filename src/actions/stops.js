import { createAction } from 'redux-actions';

export const LOAD_STOPS = 'LOAD_STOPS';
export const loadStops = createAction(LOAD_STOPS);

export const RECEIVE_STOPS = 'RECEIVE_STOPS';
export const receiveStops = createAction(RECEIVE_STOPS);

export const STOP_SELECTED = 'STOP_SELECTED';
export const stopSelected = createAction(STOP_SELECTED);

const STOP_LIST_KEY = 'STOP_LIST';
const STOP_LIST_CACHE_MS = 24 * 60 * 60 * 1000;
const STOP_LIST_API = 'http://beta.digitransit.fi/otp/routers/hsl/index/stops';

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
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        throw new Error(`Failed to fetch stop list (${response.status} ${response.statusText})`);
      }).then(data => {
        storeStopsToLocalStorage(data);
        dispatch(receiveStops(data));
      }, error => dispatch(receiveStops(error)));
  };
}
