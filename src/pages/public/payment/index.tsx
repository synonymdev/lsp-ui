import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, Link, useHistory, useRouteMatch } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshOrder, selectOrders, selectOrdersState } from '../../../store/public-store';
import { IGetOrderResponse } from '@synonymdev/blocktank-client';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import './index.scss';
import Tabs, { Tab } from '../../../components/tabs';
import PaymentRequest from '../../../components/payment-request';
import Heading from '../../../components/heading';
import { ReactComponent as LightningIconActive } from '../../../icons/lightning-active.svg';
import { ReactComponent as LightningIcon } from '../../../icons/lightning.svg';
import { ReactComponent as BitcoinIconActive } from '../../../icons/bitcoin-active.svg';
import { ReactComponent as BitcoinIcon } from '../../../icons/bitcoin.svg';

function PaymentPage(): JSX.Element {
	const { orderId } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [order, setOrder] = useState<IGetOrderResponse | undefined>(undefined);
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();
	const history = useHistory();
	const route = useRouteMatch();

	useEffect(() => {
		const newOrder = orders.find((o) => o._id === orderId);
		if (newOrder) {
			setOrder(newOrder);
			setIsLoading(false);
		}
	}, [orders]);

	useEffect(() => {
		dispatch(refreshOrder(orderId))
			.catch((e) => alert(e))
			.finally(() => setIsLoading(false));
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (order?.state === 500) {
				// Once channel is open stop trying
				return;
			}

			dispatch(refreshOrder(orderId)).catch((e) => alert(e));
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	if (!order) {
		if (ordersState === 'loading' || isLoading) {
			return (
				<FormCard>
					<Spinner style={{ fontSize: 8 }} centered />
				</FormCard>
			);
		}

		return (
			<FormCard>
				<Heading>Order not found</Heading>
				<div className={'button-container'}>
					<Link>
						<Button className={'form-button'}>Home</Button>
					</Link>
				</div>
			</FormCard>
		);
	}

	const {
		_id,
		total_amount,
		btc_address,
		zero_conf_satvbyte,
		purchase_invoice,
		amount_received,
		price,
		onchain_payments,
		order_expiry,
		state
	} = order;

	let orderStatus = '';
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
			orderStatus = 'Payment received';
			// TODO navigate to claim view
			history.push(`/claim/${_id}`);
			break;
		}
		case 400: // Given up
		case 500: // Channel open
		case 300: // Channel opening
		case 450: // Channel closed
		// TODO navigate to status view
	}

	return (
		<FormCard
			title={'New Lightning Channel'}
			backlink={'/'}
			pageIndicator={{ total: 4, active: 2 }}
		>
			<Heading>Pay now</Heading>
			<h5 className={'payment-page-subheading'}>Payment method</h5>
			<Tabs defaultActiveKey='lightning'>
				<Tab
					eventKey='lightning'
					title='Lightning'
					icon={<LightningIcon />}
					iconActive={<LightningIconActive />}
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
					iconActive={<BitcoinIconActive />}
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
		</FormCard>
	);
}

export default PaymentPage;
