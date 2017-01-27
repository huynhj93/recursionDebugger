//Libs
import React, { Component } from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
//Components
import App from './app'
import routes from './router';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

render(
	<Provider store={store}>
		<Router history={browserHistory}>
  			{routes}
  		</Router>
  </Provider>, document.getElementById('app')

);