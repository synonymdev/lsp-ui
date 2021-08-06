import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { refreshOrder, selectOrders, selectOrdersState } from '../store/cr';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { IGetOrderResponse } from '../utils/client/types';

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
			return <h1>Loading...</h1>;
		}

		return <h1>Order not found</h1>;
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
		stateMessage
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
							<Card.Text>Total amount received: {amount_received}</Card.Text>

							{onchain_payments
								? onchain_payments.map((payment) => (
									<Card.Text key={payment.hash}>
											&bull; {payment.amount_base} (fee {payment.fee_base}){' '}
										<a
											target={'_blank'}
											href={`https://mempool.space/testnet/tx/${payment.hash.toString()}`}
										>
											{payment.hash}
										</a>
									</Card.Text>
								  ))
								: null}
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<br/>

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Card.Title>LNURL</Card.Title>
							<Card.Text>Callback: {lnurl.callback}</Card.Text>
							<Card.Text>URI: {lnurl.uri}</Card.Text>
							<Card.Text>K1: {lnurl.k1}</Card.Text>
							<Card.Text>Tag: {lnurl.tag}</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}

export default OrderPage;
