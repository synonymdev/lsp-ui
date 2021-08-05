import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import ScrollToTop from './utils/ScrollToTop';
import HomePage from './pages/home';
import OrdersPage from './pages/orders';
import OrderPage from './pages/order';

function App(): JSX.Element {
	return (
		<Router>
			<div id={'home'}>
				<Navbar />
				<ScrollToTop />
				<Switch>
					<Route exact path='/'>
						<HomePage />
					</Route>

					<Route path='/orders'>
						<OrdersPage />
					</Route>

					<Route path='/order/:orderId'>
						<OrderPage />
					</Route>
				</Switch>

				{/* <Footer /> */}
			</div>
		</Router>
	);
}

export default App;
