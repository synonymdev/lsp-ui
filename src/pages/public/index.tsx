import { Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import OrderPage from '../admin/order';
import React from 'react';
import BuyPage from './buy';
import './index.scss';

function PublicPages(): JSX.Element {
	return (
		<Container className={'container'}>
			<Switch>
				<Route exact path={'/'}>
					<BuyPage />
				</Route>

				<Route path={`/order/:orderId`}>
					<OrderPage />
				</Route>
			</Switch>
		</Container>
	);
}

export default PublicPages;
