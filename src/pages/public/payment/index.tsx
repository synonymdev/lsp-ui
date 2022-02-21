import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import bip21 from 'bip21';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshOrder, selectOrders, selectOrdersState } from '../../../store/public-store';
import bt, { IGetOrderResponse } from '@synonymdev/blocktank-client';
import LineItem from '../../../components/line-item';
import CopyText from '../../../components/copy-text';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import SupportLink from '../../../components/support-link';
import QRCode from '../../../components/qr';
import './index.scss';
import { addressLink, txLink } from '../../../utils/links';
import Tabs, { Tab } from '../../../components/tabs';
import PaymentRequest from '../../../components/payment-request';
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
				<h4>Order not found</h4>
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
		onchain_payments
	} = order;

	return (
		<FormCard
			title={'New Lightning Channel'}
			backlink={'/'}
			pageIndicator={{ total: 4, active: 2 }}
		>
			<Tabs defaultActiveKey='onchain'>
				<Tab
					eventKey='lightning'
					title='Lightning'
					icon={<LightningIcon />}
					iconActive={<LightningIconActive />}
				>
					<PaymentRequest orderId={_id} lightning={{ invoice: purchase_invoice }} />
				</Tab>

				<Tab
					eventKey='onchain'
					title='On-chain'
					icon={<BitcoinIcon />}
					iconActive={<BitcoinIconActive />}
				>
					<PaymentRequest orderId={_id} onchain={{ address: btc_address, sats: total_amount }} />

					{/* <QRCode value={onChainPaymentReq} size={qrSize} /> */}
					{/* <br /> */}
					{/* <br /> */}
					{/* <CopyText>{btc_address}</CopyText> */}
					{/* <br /> */}
					{/* <p> */}
					{/*	Set fee to more than{' '} */}
					{/*	<span style={{ fontWeight: 600 }}>{zero_conf_satvbyte} sats/byte</span> to receive */}
					{/*	channel instantly */}
					{/* </p> */}
				</Tab>
			</Tabs>
		</FormCard>
	);
}

export default PaymentPage;
