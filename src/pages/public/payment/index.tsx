import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { navigate } from '../../../store/public-store';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import './index.scss';
import Tabs, { Tab } from '../../../components/tabs';
import PaymentRequest from '../../../components/payment-request';
import Heading from '../../../components/heading';
import { ReactComponent as LightningIconActive } from '../../../icons/lightning-active.svg';
import { ReactComponent as LightningIcon } from '../../../icons/lightning.svg';
import { ReactComponent as LightningIconPurple } from '../../../icons/lightning-purple.svg';
import { ReactComponent as BitcoinIconActive } from '../../../icons/bitcoin-active.svg';
import { ReactComponent as BitcoinIcon } from '../../../icons/bitcoin.svg';
import { ReactComponent as BitcoinIconActivePurple } from '../../../icons/bitcoin-active-purple.svg';
import ErrorPage from '../error';
import IconRing from '../../../components/icon-ring';
import useOrder from '../../../hooks/useOrder';

function PaymentPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const { order, orderState } = useOrder();

	// Once we've received the payment show the success view for 3 seconds before navigating to claim frame
	useEffect(() => {
		if (order?.state === 100) {
			setTimeout(() => dispatch(navigate({ page: 'claim' })), 3000);
		}
	}, [order]);

	if (!order) {
		if (orderState === 'loading' || orderState === 'idle') {
			return (
				<FormCard>
					<Spinner style={{ fontSize: 8 }} centered />
				</FormCard>
			);
		}

		return <ErrorPage type={'orderNotFound'} />;
	}

	const {
		_id,
		total_amount,
		btc_address,
		zero_conf_satvbyte,
		purchase_invoice,
		onchain_payments,
		order_expiry,
		state,
		stateMessage
	} = order;

	let orderStatus = stateMessage;
	let unconfirmedIncoming = 0;

	switch (state) {
		case 0: {
			onchain_payments.forEach((p) => {
				unconfirmedIncoming += p.amount_base;
			});

			if (unconfirmedIncoming === 0) {
				orderStatus = 'Awaiting payment';
			} else if (unconfirmedIncoming < total_amount) {
				orderStatus = 'Partial payment';
			} else {
				orderStatus = 'Unconfirmed payment';
			}

			break;
		}
		case 100: {
			// Shows a success view for 3 secs
			break;
		}
		case 400: // Given up
		case 410: // Expired
		case 500: // Channel open
		case 300: // Channel opening
		case 450: // Channel closed
			// Navigate to status view
			dispatch(navigate({ page: 'order' }));
	}
	const themeParam = new URLSearchParams(window.location.search).get('theme') ?? '';

	return (
		<FormCard
			title={'New Lightning Channel'}
			backPage={'configure'}
			pageIndicator={{ total: 4, active: 2 }}
			showLightningIcon
		>
			{state === 100 ? (
				<>
					<Heading>Payment received</Heading>
					<p>Your Lightning channel is ready to claim.</p>
					<div className={'payment-page-success-container'}>
						<IconRing icon={'checkmark'} type={'success'} />
					</div>
				</>
			) : (
				<>
					<Heading>Pay now</Heading>
					<h5 className={'payment-page-subheading'}>Payment method</h5>
					<Tabs defaultActiveKey='lightning'>
						<Tab
							eventKey='lightning'
							title='Lightning'
							icon={<LightningIcon />}
							iconActive={
								themeParam === 'ln-dark' || themeParam === 'ln-light' ? (
									<LightningIconPurple />
								) : (
									<LightningIconActive />
								)
							}
						>
							<PaymentRequest
								orderId={_id}
								orderStatus={orderStatus}
								orderExpiry={order_expiry}
								orderTotal={total_amount}
								lightning={{ invoice: purchase_invoice }}
							/>
						</Tab>

						<Tab
							eventKey='onchain'
							title='On-chain'
							icon={<BitcoinIcon />}
							iconActive={
								themeParam === 'ln-dark' || themeParam === 'ln-light' ? (
									<BitcoinIconActivePurple />
								) : (
									<BitcoinIconActive />
								)
							}
						>
							<PaymentRequest
								orderId={_id}
								orderStatus={orderStatus}
								orderExpiry={order_expiry}
								orderTotal={total_amount}
								onchain={{
									address: btc_address,
									sats: total_amount,
									zeroConfMinFee: zero_conf_satvbyte,
									receivingAmount: unconfirmedIncoming
								}}
							/>
						</Tab>
					</Tabs>
				</>
			)}
		</FormCard>
	);
}

export default PaymentPage;
