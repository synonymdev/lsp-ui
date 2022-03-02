import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from '../../components/navbar';
import HomePage from './home';
import OrdersPage from './orders';
import OrderPage from './order';
import React from 'react';

function AdminPages(): JSX.Element {
	const { path } = useRouteMatch();

	return (
		<>
			<Navbar />
			<Container>
				<Switch>
					<Route exact path={path}>
						<HomePage />
					</Route>

					<Route path={`${path}/orders`}>
						<OrdersPage />
					</Route>

					<Route path={`${path}/order/:orderId`}>
						<OrderPage />
					</Route>
				</Switch>
			</Container>
		</>
	);
}

export default AdminPages;
