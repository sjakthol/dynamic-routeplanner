import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './style.css';

const UPDATE_INTERVAL = 12000;

/**
 * A component that renders next departures for patterns that travel through
 * a specific stop.
 */
class Stop extends React.Component {
  /**
   * Start the refresh interval and trigger the first stoptime update.
   */
  componentWillMount() {
    this.props.updateStoptimes(this.props.stopId);

    this.updateInterval = setInterval(() => {
      this.props.updateStoptimes(this.props.stopId);
    }, UPDATE_INTERVAL);
  }

  /**
   * Trigger an update for the new stop.
   */
  componentWillReceiveProps(props) {
    props.updateStoptimes(props.stopId);
  }

  /**
   * Clear the refresh timer.
   */
  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  /**
   * Determine the classname to use for realtime information. This is based on
   * two variables:
   * - the realtime flag in the /stoptimes response
   * - the departureDelay in the /stoptimes response
   *
   * If the realtime flag is false, this returns 'realtime-not-available'. If
   * the departureDelay is non-zero, this returns 'realtime-updated'. Otherwise
   * we return 'realtime-ontime'.
   *
   * @param isRealtime {Boolean} - The realtime flag of the trip.
   * @param departureDelay {Number} - The difference between scheduled time.
   *
   * @return {String} The relevan classname as shown above.
   */
  getRealtimeClassName(isRealtime, departureDelay) {
    if (!isRealtime) {
      return 'realtime-not-available';
    }

    if (departureDelay !== 0) {
      return 'realtime-updated';
    }

    return 'realtime-ontime';
  }

  /**
   * Computes the actual stoptime based on the serviceDay and departure
   * timestamps.
   *
   * @param serviceDay {Number} - The number of seconds since epoch for the
   * start of the day this stop time belongs to.
   * @param departure {Number} - The number of seconds since serviceDay when the
   * stop occurs.
   *
   * @return {String} The departure time in human-readable form.
   */
  renderStopTime(serviceDay, departure) {
    const date = new Date((serviceDay + departure) * 1000);
    return date.toLocaleTimeString();
  }

  /**
   * Renders one departure for a pattern. If realtime information is available,
   * the result contains both the scheduled time and updated time.
   *
   * @param time {Immutable.Map} - The time information for this departure. See
   * propTypes for the shape.
   *
   * @return {Element} A list element with the departure time in it.
   */
  renderTime(time) {
    const serviceDaySeconds = time.get('serviceDay');
    const scheduledDepartureSeconds = time.get('scheduledDeparture');
    const scheduledDeparture = this.renderStopTime(serviceDaySeconds, scheduledDepartureSeconds);

    const realtimeClass = this.getRealtimeClassName(
      time.get('realtime'),
      time.get('departureDelay')
    );

    const realtimeDeparture = this.renderStopTime(
      time.get('serviceDay'),
      time.get('realtimeDeparture')
    );

    let realtimeInfo = null;
    if (realtimeDeparture !== scheduledDeparture) {
      realtimeInfo = ` → ${realtimeDeparture}`;
    }

    return (
      <li className={realtimeClass} key={time.get('tripId')}>
        {scheduledDeparture}{realtimeInfo}
      </li>
    );
  }

  /**
   * Rendes a single pattern.
   *
   * @param pattern {Immutable.Map} - The pattern to render. See propTypes for
   * shape.
   *
   * @param {Element} A section element for this particular pattern.
   */
  renderPattern(pattern) {
    return (
      <section className="stoptimes-pattern" key={pattern.getIn(['pattern', 'id'])}>
        <h5 className="stoptimes-pattern-desc">
          {pattern.getIn(['pattern', 'desc'])}
        </h5>
        <ul className="stoptimes-pattern-times">
          {pattern.get('times').map(this.renderTime, this)}
        </ul>
      </section>
    );
  }

  /**
   * Renders an update stamp that contains information when the data was
   * retrieved.
   *
   * @return {Element} A div with update information.
   */
  renderUpdatedStamp() {
    let updated = 'Updated: Unknown';

    if (this.props.isLoading) {
      updated = 'Updating...';
    } else if (this.props.updated) {
      const time = new Date(this.props.updated).toLocaleTimeString();
      updated = `Updated: ${time}`;
    }

    return (
      <div className="stoptimes-updated">
        {updated}
      </div>
    );
  }

  render() {
    return (
      <section className="stoptimes">
        {this.props.patterns.map(this.renderPattern, this)}
        {this.renderUpdatedStamp()}
      </section>
    );
  }
}

Stop.propTypes = {
  isLoading: React.PropTypes.bool.isRequired,
  updated: React.PropTypes.number.isRequired,
  stopId: React.PropTypes.string.isRequired,
  patterns: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    pattern: ImmutablePropTypes.mapContains({
      id: React.PropTypes.string.isRequired,
      desc: React.PropTypes.string.isRequired,
    }),
    times: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      departureDelay: React.PropTypes.number.isRequired,
      serviceDay: React.PropTypes.number.isRequired,
      scheduledDeparture: React.PropTypes.number.isRequired,
      realtime: React.PropTypes.bool.isRequired,
      realtimeDeparture: React.PropTypes.number.isRequired,
    })).isRequired,
  })).isRequired,
  updateStoptimes: React.PropTypes.func.isRequired,
};

export default Stop;
