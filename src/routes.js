import React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App from './containers/App';
import Stops from './containers/Stops';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/stops" />
    <Route path="/stops" component={Stops} />
  </Route>
);
