import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';
import PublicPages from './pages/public';
import AdminPages from './pages/admin';

function App(): JSX.Element {
	return (
		<Router>
			<ScrollToTop />
			<Switch>
				<Route exact path='/'>
					<PublicPages />
				</Route>
				<Route path='/admin'>
					<AdminPages />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
