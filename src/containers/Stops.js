import React from 'react';
import { connect } from 'react-redux';

import { fetchStopsIfNeeded } from '../actions/stops';

/**
 * A top-level component for the stop listing page.
 */
class Stops extends React.Component {
  componentWillMount() {
    this.props.fetchStopsIfNeeded();
  }

  render() {
    const stops = this.props.stops;
    const stopData = stops.get('stopData');
    const content = stopData ? <div>Loaded stops!</div> : 'Loading...';

    return (
      <div>
        <h2>Stop Timetables</h2>
        {content}
      </div>
    );
  }
}

Stops.propTypes = {
  stops: React.PropTypes.object.isRequired,
  fetchStopsIfNeeded: React.PropTypes.func.isRequired,
};

/**
 * This component only cares about the top-level stops object.
 */
const mapStateToProps = state => ({
  stops: state.stops,
});

export default connect(mapStateToProps, {
  fetchStopsIfNeeded,
})(Stops);
