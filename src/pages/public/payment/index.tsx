import { useEffect } from 'react';
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
	const initStatePayment = order?.payment.state;

	// Once we've received the payment show the success view for 3 seconds before navigating to claim frame
	useEffect(() => {
		if (initStatePayment === 'paid') {
			setTimeout(() => dispatch(navigate({ page: 'claim' })), 3000);
		}
	}, [initStatePayment]);

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
		id,
		feeSat,
		payment: {
			onchain: { address: btc_address }
		},
		payment: {
			bolt11Invoice: { request: purchase_invoice }
		},
		payment: { state: statePayment },
		payment: { state2: statePayment2 },
		orderExpiresAt,
		state,
		payment: {
			onchain: { confirmedSat: confirmedSatsIncoming }
		},
		payment: {
			onchain: { transactions: transactionsOnChain }
		}
	} = order;

	let orderStatus = statePayment2;

	if (state === 'created') {
		if (orderStatus === 'created') {
			orderStatus = 'Awaiting payment';
		} else if (transactionsOnChain.length !== 0) {
			orderStatus = 'Received, waiting...';
		}
	} else {
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
			{statePayment === 'paid' ? (
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
								orderId={id}
								orderStatus={orderStatus}
								orderExpiry={orderExpiresAt}
								orderTotal={feeSat}
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
								orderId={id}
								orderStatus={orderStatus}
								orderExpiry={orderExpiresAt}
								orderTotal={feeSat}
								onchain={{
									address: btc_address,
									sats: feeSat,
									receivingAmount: confirmedSatsIncoming,
									transactionsOnChain
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
