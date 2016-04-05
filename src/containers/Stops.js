import Immutable from 'immutable';
import React from 'react';
import { connect } from 'react-redux';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {
  fetchStopsIfNeeded,
  fetchStopTimesIfNeeded,
  stopSelected,
  removeFavorite,
  saveFavorite,
} from '../actions/stops';
import Stop from '../components/Stop';
import FavoriteStopList from '../components/FavoriteStopList';

/**
 * The minimum length of the filter string before matching any options.
 */
const FILTER_MIN_LENGTH = 2;

/**
 * A top-level component for the stop listing page.
 */
class Stops extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options: [], value: '' };
  }

  /**
   * Triggers stop list fetch when the component is mounted.
   */
  componentWillMount() {
    this.props.fetchStopsIfNeeded();
  }

  /**
   * Updates option list when new props are received.
   */
  componentWillReceiveProps(props) {
    this.updateOptionList(props.stops);
  }

  /**
   * Retrieve the information for given stop from the stop data.
   *
   * @param stops {Immutable.Map} - The stops state object.
   * @param stopId {String} - The ID for the stop to query.
   *
   * @return {Immutable.Map} The stop information for the given stop or null
   * if stop was not found.
   */
  getStopInfo(stops, stopId) {
    // Do we have any data in the state?
    if (!stops || stops.isEmpty()) {
      return null;
    }

    // Do we have the stop data?
    const stopData = stops.get('stopData');
    if (!stopData || stopData.isEmpty()) {
      return null;
    }

    // Do we have data for the stop?
    const stop = stopData.get(stopId);
    if (!stop || stop.isEmpty()) {
      return null;
    }

    // Yes \o/
    return this.stopToSelection(stop);
  }

  stopToSelection(stop) {
    return {
      value: stop.get('id'),
      label: `${stop.get('name')} (${stop.get('code')})`,
    };
  }


  /**
   * Given an Immutable stopData Map, updates the options array in the state if
   * required.
   *
   * @param stops {Immutable.Map} - The stops state object.
   */
  updateOptionList(stops) {
    const newStopData = stops.get('stopData');
    if (this.props.stops.get('stopData') === newStopData) {
      // Unchanged stopData;
      return;
    }

    const values = newStopData.toIndexedSeq().toArray();
    const options = values.map(this.stopToSelection, this);

    this.setState({ options });
  }

  /**
   * A predicate that filters options based on the given string.
   *
   * @param option {Object} - The option object to check.
   * @param filter {String} - The filter string to match against.
   *
   * @return {Boolean} - true if filter matches the option, false if not.
   */
  filterOption(option, filter) {
    const searchString = filter.toLowerCase().trim();
    return filter.length > FILTER_MIN_LENGTH &&
           option.label.toLowerCase().startsWith(searchString);
  }

  renderEmptyMessage() {
    const message = 'Select a stop by typing the stop name to the field above.';
    const favorites = this.props.stops.get('favorites');
    if (!favorites || favorites.isEmpty()) {
      return <p>{message}</p>;
    }

    const favoriteData = favorites.map(stopId => {
      const stopData = this.getStopInfo(this.props.stops, stopId);
      if (!stopData) {
        return null;
      }

      return Immutable.fromJS(stopData);
    }).filter(n => !!n);

    if (favoriteData.size === 0) {
      return <p>{message}</p>;
    }

    return (
      <div>
        <p>{message} Alternatively, you can choose a favorite stop below:</p>
        <FavoriteStopList favorites={favoriteData.toList()} onSelect={this.props.stopSelected} />
      </div>
    );
  }

  renderStop() {
    const selectedStop = this.props.stops.get('selectedStop');
    if (!selectedStop.size) {
      return this.renderEmptyMessage();
    }

    const stopId = selectedStop.get('value');
    const stopTimeData = this.props.stops.getIn(['stopTimes', stopId]);

    const empty = Immutable.fromJS([]);
    const patterns = stopTimeData ? stopTimeData.get('patterns', empty) : empty;
    const isLoading = stopTimeData ? stopTimeData.get('isFetching', false) : false;
    const updated = stopTimeData ? stopTimeData.get('timestamp', null) : null;
    return (
      <Stop
        stopId={stopId}
        patterns={patterns}
        updateStoptimes={this.props.fetchStopTimesIfNeeded}
        isLoading={isLoading}
        updated={updated}
      />
    );
  }

  renderSelectDropdown() {
    const value = this.props.stops.get('selectedStop');
    return (<Select
      autoBlur
      ignoreAccents={false}
      filterOption={this.filterOption}
      options={this.state.options}
      value={value.size ? value.toJS() : null}
      onChange={this.props.stopSelected}
      placeholder={'Find a Stop...'}
    />);
  }

  renderFavoriteButton() {
    const selected = this.props.stops.get('selectedStop');
    if (!selected || !selected.size) {
      return null;
    }

    const selectedId = selected.get('value');
    const favorites = this.props.stops.get('favorites');

    const style = { marginTop: '1em', width: '100%' };

    if (favorites.has(selectedId)) {
      const remove = this.props.removeFavorite.bind(null, selectedId);
      return (
        <button style={style} onClick={remove}>Remove from Favorites</button>
      );
    }

    const add = this.props.saveFavorite.bind(null, selectedId);
    return (
      <button style={style} onClick={add}>Save to Favorites</button>
    );
  }

  render() {
    return (
      <div>
        <h2>Stop Timetables</h2>
        <div style={{ marginBottom: '1em' }}>
          {this.renderSelectDropdown()}
          {this.renderFavoriteButton()}
        </div>
        {this.renderStop()}
      </div>
    );
  }
}

Stops.propTypes = {
  stops: React.PropTypes.object.isRequired,
  fetchStopsIfNeeded: React.PropTypes.func.isRequired,
  fetchStopTimesIfNeeded: React.PropTypes.func.isRequired,
  stopSelected: React.PropTypes.func.isRequired,
  saveFavorite: React.PropTypes.func.isRequired,
  removeFavorite: React.PropTypes.func.isRequired,
};

/**
 * This component only cares about the top-level stops object.
 */
const mapStateToProps = state => ({
  stops: state.stops,
});

export default connect(mapStateToProps, {
  fetchStopsIfNeeded,
  fetchStopTimesIfNeeded,
  stopSelected,
  saveFavorite,
  removeFavorite,
})(Stops);
