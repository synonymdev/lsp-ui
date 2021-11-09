import { Switch, Route } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import React, { ReactElement } from 'react';
import BuyPage from './buy';
import OrderPage from './order';
import './index.scss';
import FormCard from '../../components/form-card';

const PageContainer = ({ children }): ReactElement => (
	<Row className={'page-container'}>
		<Col xl={8} lg={7} md={5} sm={12} className={'infoCol'}>
			<h1>Lightning Network Services</h1>
			<br />
			<p>
				Open a connection to the Lightning Network and receive or send bitcoin instantly. Choose
				your custom capacity and BTC for your new channel, or paste a Lightning invoice to refill an
				existing channel.
			</p>
		</Col>

		<Col xl={4} lg={5} md={7} sm={12}>
			<FormCard>{children}</FormCard>
		</Col>
	</Row>
);

function PublicPages(): JSX.Element {
	return (
		<Container className={'container'}>
			<PageContainer>
				<Switch>
					<Route exact path={'/'}>
						<BuyPage />
					</Route>

					<Route path={`/order/:orderId`}>
						<OrderPage />
					</Route>

					<Route path='*'>
						<h4>404</h4>
						<p style={{ textAlign: 'center' }}>Page not found</p>
					</Route>
				</Switch>
			</PageContainer>
		</Container>
	);
}

export default PublicPages;
