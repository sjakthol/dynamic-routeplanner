import React from 'react';

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

  renderStack(error) {
    if (!error) {
      return null;
    }

    if (!this.state.showDetails) {
      return null;
    }

    return (
      <div>
        <strong style={{ fontWeight: 'bold' }}>Stack Trace:</strong>
        <blockquote className="error-bar-stack">{error.stack}</blockquote>
      </div>
    );
  }

  render() {
    return (
      <div className="error-message">
        <p>
          <strong style={{ fontWeight: 'bold' }}>Error: </strong>
          <span>{this.props.error.message || 'Unknown exception occurred.'}</span>
        </p>
        <div>
          <button className="button button" onClick={this.props.onDismissError}>
            Dismiss
          </button>
          <button className="button button-outline" onClick={this.toggleDetails}>
            {this.state.showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        {this.renderStack(this.props.error)}
      </div>
    );
  }
}

ErrorBar.propTypes = {
  error: React.PropTypes.instanceOf(Error),
  onDismissError: React.PropTypes.func.isRequired,
};
