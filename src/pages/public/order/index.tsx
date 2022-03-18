import React from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { navigate } from '../../../store/public-store';
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
import useOrder from '../../../hooks/useOrder';

function OrderPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const { order, orderState } = useOrder();

	if (!order) {
		if (orderState === 'loading' || orderState === 'idle') {
			return (
				<FormCard>
					<Spinner style={{ fontSize: 8 }} centered />
				</FormCard>
			);
		}

		return <ErrorPage type={'orderNotFound'} />;
	}

	const { state, local_balance, remote_balance, stateMessage, channel_expiry, created_at } = order;

	let heading = '';
	let icon: TIcon = 'lightning';
	let iconState: TIconRingType = 'pending';
	let headerMessage = stateMessage;
	let footerMessage = <></>;
	let showIconCross = false;

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
				'Ready to connect and establish your channel. Please ensure your node or wallet app is online and active.';
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
				'You successfully claimed your channel. Your channel will be ready to use in ± 10 - 30 minutes. Feel free to come back later.';
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
				'Orders expire if they remain unpaid for too long. If your payment was sent after this expiration, and you did not receive your channel, please contact support@synonym.to for a refund.';
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
		<FormCard title={'New Lightning Channel'} showLightningIcon>
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
