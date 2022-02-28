import React, { ReactElement } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import './index.scss';
import Heading from '../heading';

export default ({ children }): ReactElement => (
	<Container>
		<div className={'glowy-main1'} />
		<div className={'glowy-main2'} />
		<div className={'glowy-main3'} />
		<Row className={'full-webpage-container'}>
			<Col xl={6} lg={5} md={12} sm={12} className={'info-col'}>
				<div className={'info-col-content'}>
					<img src={'/icons/logo.svg'} alt={'Blocktank'} />
					<h1>Your full-service Lightning Service Provider (LSP)</h1>

					<h4>Lightning Network connections and liquidity at any size, any time.</h4>

					<p>
						Blocktank allows you to open a connection to the Lightning Network and receive or send
						bitcoin instantly. Simply set your inbound capacity (the amount of money you want to be
						able to receive) and choose how many sats you want to have ready to spend, then purchase
						your channel!
					</p>

					<p>
						Blocktank is available as a web widget and as a full-featured API.{' '}
						<a href='mailto:info@synonym.to?subject=Blocktank information request'>Contact us</a>{' '}
						for more information on how to embed and customize this widget, or to gain access to the{' '}
						<a href='https://synonym.readme.io/'>Blocktank API</a>.
					</p>

					<p>
						You can learn more about our fees in our{' '}
						<a href={'/terms-and-conditions'}>Terms & Conditions</a>.
					</p>
				</div>
			</Col>

			<Col xl={6} lg={7} md={12} sm={12} className={'widget-col'}>
				{children}
			</Col>
		</Row>
	</Container>
);
