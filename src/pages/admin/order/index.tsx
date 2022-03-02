import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { navigate, refreshOrder, selectOrders, selectOrdersState } from '../../../store/public-store';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { IGetOrderResponse } from '@synonymdev/blocktank-client';
import { addressLink, txLink, nodePubKeyLink } from '../../../utils/links';
import { Widget } from '../../public';

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
		dispatch(refreshOrder(orderId))
			.then(() => {
				dispatch(navigate({ page: 'order', orderId }));
			})
			.catch((e) => alert(e));
	}, []);

	if (!order) {
		if (ordersState === 'loading') {
			return <h1>Loading...</h1>;
		}

		return <h1>Order not found</h1>;
	}

	const {
		state,
		amount_received,
		onchain_payments,
		created_at,
		order_expiry,
		local_balance,
		remote_balance,
		price,
		stateMessage,
		btc_address,
		remote_node_src,
		channel_expiry,
		channel_open_tx,
		remote_node_uri,
		total_amount,
		zero_conf_satvbyte
	} = order;

	return (
		<div>
			<h1>Order: {new Date(created_at).toLocaleString()}</h1>
			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Card.Title>
								State: {stateMessage} ({state})
							</Card.Title>
							<Card.Text>Price: {price}</Card.Text>
							<Card.Text>Local balance: {local_balance}</Card.Text>
							<Card.Text>Remote balance: {remote_balance}</Card.Text>
							<Card.Text>Order expiry: {new Date(order_expiry).toLocaleDateString()}</Card.Text>
							{/* <Card.Text>Active channels: {node_info.active_channels_count}</Card.Text> */}
						</Card.Body>
					</Card>
				</Col>

				<Col>
					<Card>
						<Card.Body>
							<Card.Title>Payment</Card.Title>
							<Card.Text>
								Total amount received: {amount_received} of {total_amount}
							</Card.Text>

							{zero_conf_satvbyte ? (
								<Card.Text>Zero conf payment min fee: {zero_conf_satvbyte} sat/vbyte</Card.Text>
							) : null}

							<Card.Text>BTC address: {addressLink(btc_address)}</Card.Text>

							{onchain_payments
								? onchain_payments.map((payment) => (
									<Card.Text key={payment.hash}>
											&bull; {payment.amount_base} (fee {payment.fee_base}) {txLink(payment.hash)}
									</Card.Text>
								  ))
								: null}
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<br />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Card.Title>Channel details</Card.Title>
							<Card.Text>Remote node source: {remote_node_src}</Card.Text>
							<Card.Text>Remote node URI: {nodePubKeyLink(remote_node_uri)}</Card.Text>
							<Card.Text>Channel expiry: {channel_expiry}</Card.Text>
							{channel_open_tx ? (
								<Card.Text>
									Channel open tx: {txLink(channel_open_tx.transaction_id)}:
									{channel_open_tx.transaction_vout}
								</Card.Text>
							) : null}
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<br/>

			<Row style={{ display: 'flex', justifyContent: 'center' }}>
				<h4 style={{textAlign: 'center'}}>What user currently sees:</h4>
				<Widget />
			</Row>
		</div>
	);
}

export default OrderPage;
