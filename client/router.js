import React, { Component } from 'react';
import App from './app'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import Home from './components/home/home.js';
const routes = (
	<Route path ='/' component={App}>
		<IndexRedirect to='/home' />
		<Route path='home' component={Home} />
	</Route>
);

export default routes;