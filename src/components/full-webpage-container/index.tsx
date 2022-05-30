import React, { ReactElement } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import './index.scss';

const InfoCard = ({
	children,
	heading
}: {
	children: ReactElement | ReactElement[];
	heading: string;
}): ReactElement => {
	return (
		<div className={'info-card'}>
			<h4 className={'info-card-heading'}>{heading}</h4>
			{children}
		</div>
	);
};

export default ({ children }): ReactElement => (
	<div>
		<div className={'halos-container'}>
			<img className={'halo-top-left'} src={'/halos/halo-top-left.png'} />
			<img className={'halo-top'} src={'/halos/halo-top.png'} />
			<img className={'halo-footer'} src={'/halos/halo-footer.png'} />
		</div>
		<Container className={'webpage-container'}>
			<div className={'halo-top'} />
			<div className={'halo-footer'} />
			<Row className={'full-webpage-row1'}>
				<Col xl={6} lg={5} md={12} sm={12} className={'info-col'}>
					<div className={'info-col-content'}>
						<img src={'/images/logo.svg'} alt={'Blocktank'} />
						<h1 className={'webpage-heading'}>
							Your full-service Lightning Service Provider (LSP)
						</h1>

						<h4 className={'webpage-subheading'}>
							Lightning Network connections and liquidity at any size, any time.
						</h4>

						<p>
							Blocktank allows you to open a connection to the Lightning Network and receive or send
							bitcoin instantly. Simply set your inbound capacity (the amount of money you want to
							be able to receive) and choose how many sats you want to have ready to spend, then
							purchase your channel!
						</p>

						<p>
							Blocktank is available as a web widget and as a full-featured API.{' '}
							<a href='mailto:info@synonym.to?subject=Blocktank information request'>Contact us</a>{' '}
							for more information on how to embed and customize this widget, or to gain access to
							the <a href='https://synonym.readme.io/'>Blocktank API</a>.
						</p>

						<p>
							You can learn more about our fees in our{' '}
							<a href={'/terms-and-conditions'}>Terms & Conditions</a>.
						</p>
					</div>
				</Col>

				<Col xl={6} lg={7} md={12} sm={12} className={'widget-col'} id={'widget-col'}>
					{children}
				</Col>
			</Row>

			<Row>
				<Col xl={6} lg={6} md={6} sm={12} className={'info-card-col'}>
					<InfoCard heading={'Blocktank API'}>
						<p>
							The <a href='https://synonym.readme.io/'>Blocktank API</a> allows any business, app,
							or online platform to integrate and automate services from our Lightning node,
							including channel purchases, resale of channels, and information about your channels.
							Let your customers hold their own keys, offer them instant withdrawals, and tap as
							much BTC liquidity as you need.
						</p>
						<p>
							Check the <a href='https://synonym.readme.io/'>Blocktank API docs</a>, test the{' '}
							<a href='https://github.com/synonymdev/blocktank-client'>Blocktank Client</a>, or
							contact us if you want to be whitelisted for access.
						</p>
					</InfoCard>
				</Col>
				<Col xl={6} lg={6} md={6} sm={12} className={'info-card-col'}>
					<InfoCard heading={'Blocktank Web Widget'}>
						<p>
							Empower your visitors by onboarding them onto the Lightning Network as simply,
							quickly, and affordably as possible. The{' '}
							<a href={'#widget-col'}>Blocktank Web Widget</a> (see above) allows your website
							visitors to quickly configure and purchase Lightning channels and liquidity from our
							Lightning node.
						</p>
						<p>
							This widget can be embedded into any web page or platform as an iframe.{' '}
							<a href='mailto:info@synonym.to?subject=Blocktank widget implemntation'>Contact us</a>{' '}
							if you need help implementing and customizing it!
						</p>
					</InfoCard>
				</Col>
			</Row>
		</Container>
	</div>
);
