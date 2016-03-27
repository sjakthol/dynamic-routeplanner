import Immutable from 'immutable';
import React from 'react';
import { connect } from 'react-redux';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { fetchStopsIfNeeded, fetchStopTimesIfNeeded, stopSelected } from '../actions/stops';
import Stop from '../components/Stop';

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

    const stopData = this.props.stops.get('stopData');
    const options = this.getOptionList(stopData);

    this.state = { options, value: '' };
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
    const stopData = props.stops.get('stopData');
    if (stopData === this.props.stops.get('stopData')) {
      // Immutable objects, nothing changed.
      return;
    }

    const options = this.getOptionList(stopData);
    this.setState({ options });
  }

  /**
   * Given an Immutable stopData Map, returns the options array for
   * react-select.
   *
   * @param stopData {Immutable.Map} - The stopData map.
   *
   * @return {Array} - An array of { value, label } objects for react-select.
   */
  getOptionList(stopData) {
    if (!stopData) {
      return [];
    }

    const values = stopData.toIndexedSeq().toArray();
    const options = values.map(stop => ({
      value: stop.get('id'),
      label: `${stop.get('name')} (${stop.get('code')})`,
    }));

    return options;
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

  renderStop() {
    const selectedStop = this.props.stops.get('selectedStop');
    if (!selectedStop.size) {
      return (
        <p>Select a stop by typing the stop name to the field above</p>
      );
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

  render() {
    return (
      <div>
        <h2>Stop Timetables</h2>
        <div style={{ marginBottom: '1em' }}>
          {this.renderSelectDropdown()}
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
})(Stops);
