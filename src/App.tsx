import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/footer';
import ScrollToTop from './utils/ScrollToTop';

function App(): JSX.Element {
	return (
		<Router>
			<div id={'home'}>
				<Navbar />
				<ScrollToTop />
				<Switch>
					<Route exact path='/'>
						<div />
					</Route>

					<Route path='/order'>
						<div />
					</Route>
				</Switch>

				<Footer />
			</div>
		</Router>
	);
}

export default App;
