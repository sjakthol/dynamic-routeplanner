import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import routes from '../routes';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>
);

Root.propTypes = {
  history: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired,
};

export default Root;
