import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
	navigate,
	refreshOrder,
	selectCurrentOrderId,
	selectOrders,
	selectOrdersState
} from '../../../store/public-store';
import { IGetOrderResponse } from '@synonymdev/blocktank-client';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import './index.scss';
import Heading from '../../../components/heading';
import Divider from '../../../components/divider';
import ValueGroup from '../../../components/value-group';
import IconRing, { TIconRingType, TIcon } from '../../../components/icon-ring';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-active.svg';
import { ReactComponent as ClockIcon } from '../../../icons/clock-active.svg';
import ErrorPage from '../error';

function OrderPage(): JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
	const orderId = useAppSelector(selectCurrentOrderId);
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

		return <ErrorPage type={'orderNotFound'} />;
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
		created_at
	} = order;

	let heading = '';
	let icon: TIcon = 'lightning';
	let iconState: TIconRingType = 'pending';
	let headerMessage = stateMessage;
	let footerMessage = <></>;
	let showIconCross = false;

	// let state = 100;
	// if (state) {
	// 	state = 450;
	// }

	switch (state) {
		case 0: {
			dispatch(navigate({ page: 'payment' }));
			break;
		}
		case 100: {
			dispatch(navigate({ page: 'claim' }));
			break;
		}
		case 200: // URI set
			icon = 'hourglass';
			iconState = 'pending';
			heading = 'Opening channel';
			headerMessage =
				'We are ready to connect to your node and establish your channel. Please ensure your node or wallet app is online and active.';
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
		case 300: // Channel opening
			icon = 'hourglass';
			iconState = 'pending';
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
			icon = 'thumb-down';
			iconState = 'error';
			heading = 'Channel failed';
			headerMessage =
				'Unfortunately, we were unable to open the channel. It could be the case that your node dropped connection or is offline. Please contact support@synonym.to for assistance.';
			break;
		case 410: // Order expired
			icon = 'thumb-down';
			iconState = 'error';
			heading = 'Order expired';
			headerMessage =
				'Unfortunately, we were unable to open the channel as a payment was not received in time.';
			break;
		case 450: // Channel closed
			iconState = 'neutral';
			showIconCross = true;
			heading = 'Channel closed';
			headerMessage = 'This Lightning channel has expired.';
			break;
		case 500: // Channel open
			iconState = 'success';
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
		<FormCard backPage={'configure'} title={'New Lightning Channel'}>
			<Heading>{heading}</Heading>
			<div className={'order-state-container'}>
				<p className={'order-state-message'}>{headerMessage}</p>
				<IconRing icon={icon} type={iconState} showCross={showIconCross} />
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
