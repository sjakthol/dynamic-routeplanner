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

    this.state = { options: [], value: '' };
    this.updateOptionList(props);
  }

  componentWillMount() {
    this.props.fetchStopsIfNeeded();
  }

  componentWillReceiveProps(props) {
    this.updateOptionList(props);
  }

  updateOptionList(props) {
    const { stops } = props;
    const stopData = stops.get('stopData');
    if (!stopData) {
      return;
    }

    const values = stopData.toIndexedSeq().toArray();
    const options = values.map(stop => ({
      value: stop.get('id'),
      label: `${stop.get('name')} (${stop.get('code')})`,
    }));

    this.setState({ options });
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
          onBlurResetsInput={false}
          ignoreAccents={false}
          filterOption={this.filterOption}
          options={this.state.options}
          value={value ? value.toJS() : null}
          onChange={this.props.stopSelected}
          placeholder={"Find a Stop..."}
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
