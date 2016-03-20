import React from 'react';
import { connect } from 'react-redux';

import { dismissError } from '../actions';
import ErrorBar from '../components/ErrorBar';

import 'normalize.css/normalize.css';
import 'milligram';

class App extends React.Component {
  renderError() {
    if (!this.props.error) {
      return null;
    }

    return <ErrorBar error={this.props.error} onDismissError={this.props.dismissError} />;
  }
  render() {
    return (
      <main>
        {this.renderError()}
        {this.props.children}
      </main>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
  error: React.PropTypes.instanceOf(Error),
  dismissError: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  error: state.error,
});

export default connect(mapStateToProps, {
  dismissError,
})(App);
