import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Navbar from './components/navbar';
import ScrollToTop from './utils/ScrollToTop';
import HomePage from './pages/home';
import OrdersPage from './pages/orders';
import OrderPage from './pages/order';
import BuyPage from './pages/buy';

function App(): JSX.Element {
	return (
		<Router>
			<Navbar />
			<ScrollToTop />
			<Container>
				<Switch>
					<Route exact path='/'>
						<HomePage />
					</Route>

					<Route path='/buy/:productId'>
						<BuyPage />
					</Route>

					<Route path='/order/:orderId'>
						<OrderPage />
					</Route>
				</Switch>

				{/* <Footer /> */}
			</Container>
		</Router>
	);
}

export default App;
