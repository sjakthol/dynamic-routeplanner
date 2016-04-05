import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FavoriteStopLink from './link';

/**
 * A component for rendering a list of FavoriteStopLinks.
 */
const FavoriteStopList = props => {
  const favorites = props.favorites.map(
    favorite => <FavoriteStopLink stop={favorite} onSelect={props.onSelect} />
  );

  return (
    <ul style={{ marginLeft: '1em' }}>
      {favorites}
    </ul>
  );
};

const Favorite = ImmutablePropTypes.mapContains({
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
}).isRequired;

FavoriteStopList.propTypes = {
  favorites: ImmutablePropTypes.listOf(Favorite).isRequired,
  onSelect: React.PropTypes.func.isRequired,
};

export default FavoriteStopList;
