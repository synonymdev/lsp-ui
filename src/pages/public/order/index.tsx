import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
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
		...rest
	} = order;

	return (
		<div>
			<h4>Payment</h4>
			<LineItem label={'Order status'} value={stateMessage} />
			<LineItem label={'Order expiry'} value={new Date(order_expiry).toLocaleString()} />
			<LineItem label={'Local balance'} value={local_balance} />
			<LineItem label={'Remote balance'} value={remote_balance} />
			<LineItem label={'Channel expiry'} value={channel_expiry} />

			<br />
			<div style={{ textAlign: 'center' }}>
				<Tabs defaultActiveKey='onchain' className='mb-3'>
					<Tab eventKey='onchain' title='On chain payment'>
						<QRCode value={btc_address} />
						<br />
						<br />
						<p>{btc_address}</p>
						<p>
							Set fee to more than <b>{zero_conf_satvbyte} sats/byte</b> to receive channel
							instantly
						</p>
					</Tab>
					<Tab eventKey='lightning' title='Lightning invoice'>
						<QRCode value={purchase_invoice} />
						<br />
						<br />
						<p>{purchase_invoice}</p>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}

export default OrderPage;
