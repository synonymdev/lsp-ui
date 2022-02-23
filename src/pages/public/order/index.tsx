import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import bip21 from 'bip21';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshOrder, selectOrders, selectOrdersState } from '../../../store/public-store';
import bt, { IGetOrderResponse } from '@synonymdev/blocktank-client';
import CopyText from '../../../components/copy-text';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import QRCode from '../../../components/qr';
import './index.scss';
import InputGroup from '../../../components/input-group';
import Heading from '../../../components/heading';
import Divider from '../../../components/divider';
import ValueGroup from '../../../components/value-group';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-active.svg';
import { ReactComponent as ClockIcon } from '../../../icons/clock-active.svg';

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

// TODO deprecated
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

	let heading = '';
	let iconName = 'lightning-3d.png';

	const {
		_id,
		state,
		amount_received,
		order_expiry,
		local_balance,
		remote_balance,
		stateMessage,
		channel_expiry,
		created_at
	} = order;

	console.log(stateMessage);

	let headerMessage = stateMessage;
	let footerMessage = <></>;
	let stateStyle = 'pending';
	let showIconCross = false;

	// let state = 100;
	// if (state) {
	// 	state = 450;
	// }

	switch (state) {
		case 0: {
			// TODO back to payment
			break;
		}
		case 100: {
			// TODO back to claim
			break;
		}
		case 200: // URI set
		case 300: // Channel opening
			iconName = 'hourglass-3d.png';
			stateStyle = 'pending';
			heading = 'Opening channel';
			headerMessage =
				'You successfully claimed your channel. Your channel will be ready to use in 10 - 30 minutes or so. Feel free to come back later.';
			footerMessage = (
				<>
					This channel will stay open for at least{' '}
					<span className={'highlight'}>
						{channel_expiry} week{channel_expiry === 1 ? '' : 's'}
					</span>
					.
				</>
			);
			break;
		case 400: // Given up
			iconName = 'thumb-down-3d.png';
			stateStyle = 'error';
			heading = 'Channel failed';
			headerMessage =
				'Unfortunately, we were unable to open the channel. It could be the case that your node dropped connection or is offline. Please contact support@synonym.to for assistance.';
			break;
		case 450: // Channel closed
			stateStyle = 'neutral';
			showIconCross = true;
			heading = 'Channel closed';
			headerMessage = 'This Lightning channel has expired.';
			break;
		case 500: // Channel open
			stateStyle = 'success';
			heading = 'Channel live';
			headerMessage = 'Your Lightning channel is currently open and is ready for use.';
			footerMessage = (
				<>
					This channel will stay open for at least{' '}
					<span className={'highlight'}>
						{channel_expiry} week{channel_expiry === 1 ? '' : 's'}
					</span>
					.
				</>
			);
			break;
	}

	const date = new Date(created_at);

	return (
		<FormCard title={'New Lightning Channel'}>
			<Heading>{heading}</Heading>
			<div className={'order-state-container'}>
				<p className={'order-state-message'}>{headerMessage}</p>
				<div className={'icon-ring-container'}>
					<div className={`icon-ring-${stateStyle}`}>
						<img alt={heading} className={'icon-ring-image'} src={`/icons/${iconName}`} />
						{showIconCross ? <div className={'icon-ring-neutral-line'} /> : null}
					</div>
				</div>

				<Divider />

				<div className={'value-group-row'}>
					<ValueGroup
						label={'Order date'}
						value={date.toLocaleString('en-US', {
							month: 'short',
							day: 'numeric',
							year: 'numeric'
						})}
						Icon={CalendarIcon}
					/>
					<ValueGroup
						label={'Order time'}
						value={date.toLocaleTimeString('en-US', {
							hour: 'numeric',
							minute: 'numeric',
							hour12: false
						})}
						Icon={ClockIcon}
					/>
				</div>

				<div className={'value-group-row'}>
					<ValueGroup label={'Inbound capacity'} value={local_balance} showFiat />
					<ValueGroup label={'My balance'} value={remote_balance} showFiat />
				</div>

				{footerMessage ? <p className={'order-state-message'}>{footerMessage}</p> : null}
			</div>
		</FormCard>
	);
}

export default OrderPage;
