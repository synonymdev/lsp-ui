import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import bip21 from 'bip21';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshOrder, selectOrders, selectOrdersState } from '../../../store/cr';
import bt, { IGetOrderResponse, IService } from '@synonymdev/blocktank-client';
import LineItem from '../../../components/line-item';
import CopyText from '../../../components/copy-text';
import FormCard from '../../../components/form-card';
import './index.scss';
import Spinner from '../../../components/spinner';

const Payment = ({ order }: { order: IGetOrderResponse }): ReactElement => {
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

	const onChainPaymentReq = bip21.encode(btc_address, {
		amount: total_amount / 100000000,
		label: `Blocktank #${_id}`
	});

	// TODO if incoming payment show that instead
	//			<p>{JSON.stringify(onchain_payments)}</p>

	return (
		<div style={{ textAlign: 'center' }}>
			{/* <p>{JSON.stringify(onchain_payments)}</p> */}
			<Tabs defaultActiveKey='onchain' className='mb-3 payment-tabs'>
				<Tab eventKey='onchain' title='On chain payment'>
					<QRCode value={onChainPaymentReq} />
					<br />
					<br />
					<CopyText>{btc_address}</CopyText>
					<br />
					<p>
						Set fee to more than <b>{zero_conf_satvbyte} sats/byte</b> to receive channel instantly
					</p>
				</Tab>
				<Tab eventKey='lightning' title='Lightning invoice'>
					<QRCode value={purchase_invoice} />
					<br />
					<br />
					<CopyText>{purchase_invoice}</CopyText>
				</Tab>
			</Tabs>
		</div>
	);
};

const ClaimChannel = ({ order }: { order: IGetOrderResponse }): ReactElement => {
	const { _id, lnurl_string } = order;
	const dispatch = useAppDispatch();
	const [showManual, setShowManual] = useState(false);
	const [nodeUri, setNodeUri] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const claimChannel = async (): Promise<void> => {
		setIsSubmitting(true);
		try {
			await bt.finalizeChannel({
				order_id: _id,
				node_uri: nodeUri
			});

			await dispatch(refreshOrder(_id));
		} catch (e) {
			alert(e);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div style={{ textAlign: 'center' }}>
			{showManual ? (
				<>
					<Form>
						<Form.Group>
							<Form.Label>Node URI</Form.Label>
							<Form.Control
								type='text'
								placeholder={'nodeid@ip:port'}
								value={nodeUri}
								onChange={(e) => setNodeUri(e.target.value)}
							/>
						</Form.Group>

						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button
								className={'form-button'}
								onClick={claimChannel}
								type='submit'
								disabled={isSubmitting}
							>
								Open channel
							</Button>
						</div>
					</Form>
				</>
			) : (
				<>
					<QRCode value={lnurl_string} />
					<br />
					<br />
					<p>Scan QR to claim your channel</p>

					<CopyText>{lnurl_string}</CopyText>
				</>
			)}

			<br />

			<span className={'link'} onClick={() => setShowManual(!showManual)}>
				{showManual ? 'Automatic claim' : 'Manual channel claim'}
			</span>
		</div>
	);
};

function OrderPage(): JSX.Element {
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
			return <Spinner style={{ fontSize: 8 }} />;
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
			content = <Payment order={order} />;
			break;
		// case 400:
		// 	return 'Given up';
		// case 500:
		// 	return 'Channel open';
		// case 300:
		// 	return 'Channel opening';
		case 100: {
			content = <ClaimChannel order={order} />;
			break;
		}
		// case 450:
		// return 'Channel closed';
	}

	return (
		<FormCard>
			<h4>Order</h4>
			<LineItem label={'Order status'} value={stateMessage} spinner={state === 0} />
			{state === 0 ? (
				<LineItem label={'Received'} value={`${amount_received}/${total_amount} sats`} />
			) : null}
			<LineItem label={'Order expiry'} value={new Date(order_expiry).toLocaleString()} />
			<LineItem label={'Remote balance'} value={`${local_balance} sats`} />
			<LineItem label={'Local balance'} value={`${remote_balance} sats`} />
			<LineItem label={'Channel expiry'} value={`${channel_expiry} weeks`} />

			<br />

			{content}
		</FormCard>
	);
}

export default OrderPage;
