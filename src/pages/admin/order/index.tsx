import { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {
	navigate,
	refreshOrder,
	selectOrders,
	selectOrdersState
} from '../../../store/public-store';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addressLink, txLink, nodePubKeyLink } from '../../../utils/links';
import { Widget } from '../../public';
import OrderActions from '../../../components/admin/order-actions';
import { UseOrderResponse } from '../../../utils/helpers';

function OrderPage(): JSX.Element {
	const { orderId } = useParams();
	const [order, setOrder] = useState<UseOrderResponse | undefined>(undefined);

	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const newOrder = orders.find((o) => o.id === orderId);
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
		payment: { paidSat: amount_received },
		payment: {
			onchain: { transactions: onchain_payments }
		},
		createdAt,
		orderExpiresAt,
		lspBalanceSat,
		clientBalanceSat,
		feeSat,
		payment: {
			bolt11Invoice: { state: stateBoltInvoice }
		},
		payment: {
			onchain: { address: btc_address }
		},
		lspNode: { alias: remote_node_src },
		channelExpiresAt,
		lspNode: { pubkey: remote_node_uri }
	} = order;

	return (
		<div>
			<Row>
				<Col lg={7}>
					<h2>{new Date(createdAt).toLocaleString()}</h2>

					<OrderActions orderId={orderId} />

					<br />
					<br />

					<Card>
						<Card.Body>
							<Card.Title>
								State: {stateBoltInvoice} ({state})
							</Card.Title>
							<Card.Text>Price: {feeSat}</Card.Text>
							<Card.Text>Local balance: {lspBalanceSat}</Card.Text>
							<Card.Text>Remote balance: {clientBalanceSat}</Card.Text>
							<Card.Text>Order expiry: {new Date(orderExpiresAt).toLocaleDateString()}</Card.Text>
							{/* <Card.Text>Active channels: {node_info.active_channels_count}</Card.Text> */}
						</Card.Body>
					</Card>

					<br />

					<Card>
						<Card.Body>
							<Card.Title>Payment</Card.Title>
							<Card.Text>
								Total amount received: {amount_received} of xxxsats{}
							</Card.Text>

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

					<br />

					<Card>
						<Card.Body>
							<Card.Title>Channel details</Card.Title>
							<Card.Text>Remote node source: {remote_node_src}</Card.Text>
							<Card.Text>Remote node URI: {nodePubKeyLink(remote_node_uri)}</Card.Text>
							<Card.Text>Channel expiry: {channelExpiresAt}</Card.Text>
						</Card.Body>
					</Card>

					<br />

					<Accordion>
						<Accordion.Item eventKey='0'>
							<Accordion.Header>Debug data</Accordion.Header>
							<Accordion.Body>
								<pre>{JSON.stringify(order, null, 2)}</pre>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</Col>

				<Col lg={5}>
					<h4>What user currently sees:</h4>
					<Widget />
				</Col>
			</Row>
		</div>
	);
}

export default OrderPage;
