import React from 'react';
import CustomError from '../../models/CustomError';

import './style.css';

export default class ErrorBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showDetails: false };
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    this.setState({ showDetails: !this.state.showDetails });
  }

  renderOriginalException(error) {
    if (!error) {
      return null;
    }

    if (!this.state.showDetails) {
      return null;
    }

    return (
      <div>
        <p>{error.message}</p>
        <strong style={{ fontWeight: 'bold' }}>Stack Trace:</strong>
        <blockquote className="error-bar-stack">{error.stack}</blockquote>
      </div>
    );
  }

  render() {
    return (
      <div className="error-message">
        <strong style={{ fontWeight: 'bold' }}>Error: </strong>
        <span>{this.props.error.message}</span>
        <button className="button button-clear" onClick={this.toggleDetails}>
          {this.state.showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        <button className="button button-outline" onClick={this.props.onDismissError}>
          Dismiss Error
        </button>
        {this.renderOriginalException(this.props.error.originalException)}
      </div>
    );
  }
}

ErrorBar.propTypes = {
  error: React.PropTypes.instanceOf(CustomError),
  onDismissError: React.PropTypes.func.isRequired,
};
