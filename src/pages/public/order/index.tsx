import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import bip21 from 'bip21';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
	refreshInfo,
	refreshOrder,
	selectInfo,
	selectInfoState,
	selectOrders,
	selectOrdersState
} from '../../../store/cr';
import bt, { IBuyChannelRequest, IGetOrderResponse, IService } from '@synonymdev/blocktank-client';
import LineItem from '../../../components/line-item';
import './index.scss';

const PaymentTabs = ({ order }: { order: IGetOrderResponse }): ReactElement => {
	const { _id, total_amount, btc_address, zero_conf_satvbyte, purchase_invoice } = order;

	const onChainPaymentReq = bip21.encode(btc_address, {
		amount: total_amount / 100000000,
		label: `Blocktank #${_id}`
	});

	return (
		<div style={{ textAlign: 'center' }}>
			<Tabs defaultActiveKey='onchain' className='mb-3 payment-tabs'>
				<Tab eventKey='onchain' title='On chain payment'>
					<QRCode value={onChainPaymentReq} />
					<br />
					<br />
					<p className={'pay-request'}>{btc_address}</p>
					<p>
						Set fee to more than <b>{zero_conf_satvbyte} sats/byte</b> to receive channel instantly
					</p>
				</Tab>
				<Tab eventKey='lightning' title='Lightning invoice'>
					<QRCode value={purchase_invoice} />
					<br />
					<br />
					<p className={'pay-request'}>{purchase_invoice}</p>
				</Tab>
			</Tabs>
		</div>
	);
};

function OrderPage(): JSX.Element {
	const { orderId } = useParams();

	const [order, setOrder] = useState<IGetOrderResponse | undefined>(undefined);

	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const newOrder = orders.find((o) => o._id === orderId);
		if (newOrder) {
			setOrder(newOrder);
		}
	}, [orders]);

	useEffect(() => {
		dispatch(refreshOrder(orderId)).catch((e) => alert(e));
	}, []);

	if (!order) {
		if (ordersState === 'loading') {
			return <h4>Loading...</h4>;
		}

		return <h4>Order not found</h4>;
	}

	const {
		_id,
		state,
		amount_received,
		onchain_payments,
		channel_expiry_ts,
		created_at,
		order_expiry,
		lnurl,
		local_balance,
		remote_balance,
		price,
		purchase_invoice,
		stateMessage,
		btc_address,
		remote_node_src,
		channel_expiry,
		channel_open_tx,
		remote_node_uri,
		total_amount,
		zero_conf_satvbyte,
		zero_conf_satvbyte_expiry,
		renewals
	} = order;

	let content = <></>;
	switch (state) {
		case 0:
			content = <PaymentTabs order={order} />;
			break;
		// case 400:
		// 	return 'Given up';
		// case 500:
		// 	return 'Channel open';
		// case 300:
		// 	return 'Channel opening';
		case 100: {
			// TODO lnurl QR
			break;
		}
		// case 450:
		// return 'Channel closed';
	}

	return (
		<div>
			<h4>Payment</h4>
			<LineItem label={'Order status'} value={stateMessage} />
			<LineItem label={'Order expiry'} value={new Date(order_expiry).toLocaleString()} />
			<LineItem label={'Remote balance'} value={`${local_balance} sats`} />
			<LineItem label={'Local balance'} value={`${remote_balance} sats`} />
			<LineItem label={'Channel expiry'} value={`${channel_expiry} weeks`} />

			{/* <pre>{JSON.stringify(onchain_payments)}</pre> */}

			<br />

			{content}
		</div>
	);
}

export default OrderPage;
