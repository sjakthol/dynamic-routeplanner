import React from 'react';
import { connect } from 'react-redux';

import { fetchStopsIfNeeded, stopSelected } from '../actions/stops';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

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

  filterOption(option, filter) {
    const searchString = filter.toLowerCase().trim();
    return filter.length > 2 && option.label.toLowerCase().startsWith(searchString);
  }

  renderStop(selectedStop) {
    if (!selectedStop) {
      return null;
    }

    return <p>{selectedStop.get('label')}</p>;
  }

  render() {
    const value = this.props.stops.get('selectedStop');
    return (
      <div>
        <h2>Stop Timetables</h2>
        <Select
          autoBlur
          ignoreAccents={false}
          filterOption={this.filterOption}
          options={this.state.options}
          value={value.size ? value.toJS() : null}
          onChange={this.props.stopSelected}
          placeholder={'Find a Stop...'}
        />
        {this.renderStop(value)}
      </div>
    );
  }
}

Stops.propTypes = {
  stops: React.PropTypes.object.isRequired,
  fetchStopsIfNeeded: React.PropTypes.func.isRequired,
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
  stopSelected,
})(Stops);
