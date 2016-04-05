import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

/**
 * A component that renders a single favorite stop link and attaches relevant
 * event handlers.
 */
export default class FavoriteStopLink extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  /**
   * A handler for the link click. This will invoke the callback function
   * provided in props with a { value, label } object to be compatible with
   * react-select.
   */
  onSelect() {
    this.props.onSelect(this.props.stop.toJS());
  }

  render() {
    return (<li key={this.props.stop.get('value')}>
      <a href="#" onClick={this.onSelect}>{this.props.stop.get('label')}</a>
    </li>);
  }
}

FavoriteStopLink.propTypes = {
  stop: ImmutablePropTypes.mapContains({
    value: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
  }).isRequired,
  onSelect: React.PropTypes.func.isRequired,
};
