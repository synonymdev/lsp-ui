import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from '../../components/navbar';
import OrderPage from '../admin/order';
import React from 'react';

function PublicPages(): JSX.Element {
	return (
		<>
			<Container>
				<Switch>
					<Route exact path={'/'}>
						<h1>Public</h1>
					</Route>

					<Route path={`/order/:orderId`}>
						<OrderPage />
					</Route>
				</Switch>
			</Container>
		</>
	);
}

export default PublicPages;
