import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
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
import InputGroup from '../../../components/input-group';
import PageIndicator from '../../../components/page-indicator';

const qrSize = 220;

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

	return (
		<div style={{ textAlign: 'center' }}>
			<Tabs defaultActiveKey='onchain' className='mb-3 payment-tabs'>
				<Tab eventKey='onchain' title='On chain payment'>
					<QRCode value={onChainPaymentReq} size={qrSize} />
					<br />
					<br />
					<CopyText>{btc_address}</CopyText>
					<br />
					<p>
						Set fee to more than{' '}
						<span style={{ fontWeight: 600 }}>{zero_conf_satvbyte} sats/byte</span> to receive
						channel instantly
					</p>
				</Tab>
				<Tab eventKey='lightning' title='Lightning invoice'>
					<QRCode value={purchase_invoice} size={qrSize} />
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

	const onSetNodeUri = (e: React.ChangeEvent<any>): void => setNodeUri(e.target.value);

	return (
		<div style={{ textAlign: 'center' }}>
			{showManual ? (
				<>
					<Form>
						<InputGroup
							type='text'
							value={nodeUri}
							onChange={onSetNodeUri}
							id={'node-uri'}
							placeholder={'nodeid@ip:port'}
							label={'Node URI'}
							// error={formErrors.remoteBalance}
						/>

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
					<QRCode value={lnurl_string} size={qrSize} />
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
		state,
		amount_received,
		order_expiry,
		local_balance,
		remote_balance,
		stateMessage,
		channel_expiry,
		total_amount,
		onchain_payments,
		btc_address
	} = order;

	let content = <></>;
	let paymentLineItem = <></>;
	let orderStatus = stateMessage;

	switch (state) {
		case 0: {
			let unconfirmedIncoming = 0;
			onchain_payments.forEach((p) => {
				unconfirmedIncoming += p.amount_base;
			});

			let link = <></>;
			if (onchain_payments.length === 1) {
				link = txLink(onchain_payments[0].hash);
			} else {
				link = addressLink(btc_address);
			}

			paymentLineItem = (
				<LineItem
					label={'Received'}
					value={`${unconfirmedIncoming || amount_received}/${total_amount} sats`}
				/>
			);

			orderStatus = 'Unconfirmed payment';

			// If we haven't yet received the full amount, keep showing the payment options
			if (unconfirmedIncoming < total_amount) {
				content = <Payment order={order} />;
			} else {
				content = <p className={'payment-link'}>Unconfirmed transaction: {link}</p>;
			}

			break;
		}
		case 100: {
			content = <ClaimChannel order={order} />;
			break;
		}
		case 400: // Given up
		case 500: // Channel open
		case 300: // Channel opening
		case 450: // Channel closed
	}

	return (
		<FormCard>
			<LineItem label={'Order status'} value={orderStatus} spinner={state === 0} />
			{paymentLineItem}
			<LineItem label={'Order expiry'} value={new Date(order_expiry).toLocaleString()} />
			<LineItem label={'Remote balance'} value={`${local_balance} sats`} />
			<LineItem label={'Local balance'} value={`${remote_balance} sats`} />
			<LineItem label={'Channel expiry'} value={`${channel_expiry} weeks`} />

			<br />

			{content}

			<SupportLink orderId={_id} />

			<PageIndicator total={4} active={2} />
		</FormCard>
	);
}

export default OrderPage;
