import { Switch, Route } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import React, { ReactElement } from 'react';
import ConfigurePage from './configure';
import OrderPage from './order';
import OrdersPage from './orders';
import './index.scss';
import ConfirmationPage from './confirm';
import PaymentPage from './payment';
import ClaimPage from './claim';
import ErrorPage from './error';

export const PageContainer = ({ children }): ReactElement => (
	<>
		<div className={'glowy-main1'} />
		<div className={'glowy-main2'} />
		<div className={'glowy-main3'} />

		<Row className={'page-container'}>{children}</Row>
	</>
);

const CardContainer = ({ children }): ReactElement => (
	<PageContainer>
		<Col xl={6} lg={5} md={4} sm={12} className={'infoCol'}>
			<h1>Lightning Network Services</h1>
			<br />
			<p>
				Open a connection to the Lightning Network and receive or send bitcoin instantly. Choose
				your custom capacity and BTC for your new channel, or paste a Lightning invoice to refill an
				existing channel.
			</p>
		</Col>

		<Col xl={6} lg={7} md={8} sm={12}>
			{children}
		</Col>
	</PageContainer>
);

function PublicPages(): JSX.Element {
	const routes = (
		<Switch>
			<Route exact path={['/', '/blocktank']}>
				<ConfigurePage />
			</Route>

			<Route path={['/confirm/:orderId', '/blocktank/confirm/:orderId']}>
				<ConfirmationPage />
			</Route>

			<Route path={['/payment/:orderId', '/blocktank/payment/:orderId']}>
				<PaymentPage />
			</Route>

			<Route path={['/claim/:orderId', '/blocktank/claim/:orderId']}>
				<ClaimPage />
			</Route>

			<Route path={['/order/:orderId', '/blocktank/order/:orderId']}>
				<OrderPage />
			</Route>

			<Route path={['/orders', '/blocktank/orders']}>
				<OrdersPage />
			</Route>

			<Route path={['/error', '/blocktank/error']}>
				<ErrorPage type={'geoblocked'} />
			</Route>

			<Route path='*'>
				<div style={{ textAlign: 'center' }}>
					<h4>404</h4>
					<p>Page not found</p>
				</div>
			</Route>
		</Switch>
	);

	if (
		new URLSearchParams(window.location.search).get('embed') === 'true' ||
		(window as any).embedwidget === true
	) {
		return routes;
	}

	return (
		<Container className={'container'}>
			<CardContainer>{routes}</CardContainer>
		</Container>
	);
}

export default PublicPages;
