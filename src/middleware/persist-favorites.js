export const FAVORITES_KEY = 'stops--favorites';
export const persistFavoritesMiddleware = store => next => action => {
  const result = next(action);

  const state = store.getState();
  const stops = state.stops;
  if (!stops) {
    return result;
  }

  const favorites = stops.get('favorites');
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

  return result;
};

/**
 * Retrieve the list of favorite stops from the local storage.
 *
 * @return {Array} The list of favorite stop IDs or null if undefined.
 */
export function getFavoritesFromStorage() {
  const favoritesJSON = localStorage.getItem(FAVORITES_KEY);
  if (!favoritesJSON) {
    return null;
  }

  try {
    return JSON.parse(favoritesJSON);
  } catch (e) {
    return null;
  }
}
