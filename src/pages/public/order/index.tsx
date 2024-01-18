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
import { supportEmail, supportHref } from '../../../settings';
import ActionButton from '.././../../components/action-button';
import SupportButton from '.././../../components/support-link';

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

	const {
		state,
		lspBalanceSat,
		clientBalanceSat,
		channelExpiryWeeks,
		createdAt,
		payment: { state2: statePayment2 },
		payment: { state: statePayment },
		payment: {
			onchain: { confirmedSat }
		}
	} = order;

	let heading = '';
	let icon: TIcon = 'lightning-3d';
	let iconState: TIconRingType = 'pending';
	let headerMessage = <span>{statePayment2}</span>;
	let footerMessage = <></>;
	let showIconCross = false;
	let showSupportButtons = false;

	const supportLink = <a href={supportHref(order.id)}>{supportEmail}</a>;

	if (state === 'created') {
		if (statePayment2 === 'created') dispatch(navigate({ page: 'payment' }));
		else if (statePayment === 'paid') dispatch(navigate({ page: 'claim' }));
		else if (statePayment2 === 'paid' || confirmedSat !== 0) {
			icon = 'hourglass-3d';
			iconState = 'pending';
			heading = 'Opening channel';
			headerMessage = (
				<span>
					You successfully claimed your channel. Your channel will be ready to use in 10 - 30
					minutes or so. Feel free to come back later.
				</span>
			);
			footerMessage = (
				<>
					This channel will stay open for at least{' '}
					<span className={'highlight'}>
						{channelExpiryWeeks} week{channelExpiryWeeks === 1 ? '' : 's'}
					</span>
					.
				</>
			);
		} else if (statePayment2 === 'canceled') {
			iconState = 'neutral';
			showIconCross = true;
			heading = 'Channel cancelled';
			headerMessage = <span>This Lightning channel has cancelled.</span>;
		}
	} else if (state === 'open') {
		iconState = 'success';
		heading = 'Channel live';
		headerMessage = <span>Your Lightning channel is currently open and is ready for use.</span>;
		footerMessage = (
			<>
				This channel will stay open for at least{' '}
				<span className={'highlight'}>
					{channelExpiryWeeks} week{channelExpiryWeeks === 1 ? '' : 's'}
				</span>
				.
			</>
		);
	} else if (state === 'expired') {
		icon = 'stopwatch-3d';
		iconState = 'error';
		heading = 'Order expired';
		headerMessage = (
			<span>
				Orders expire if they remain unpaid for too long. If your payment was sent after this
				expiration, and you did not receive your channel, please contact {supportLink} for a refund.
			</span>
		);
		showSupportButtons = true;
	} else if (state === 'closed') {
		if (statePayment === 'paid') {
			iconState = 'neutral';
			showIconCross = true;
			heading = 'Channel closed';
			headerMessage = <span>This Lightning channel has expired or has closed.</span>;
		} else {
			icon = 'lightning-3d';
			iconState = 'error';
			heading = 'Channel failed';
			headerMessage = (
				<span>
					We were unable to open the channel. Your node might not be properly configured, or it is
					offline, or behind a firewall, or not fully synced. Please contact {supportLink} for
					assistance.
				</span>
			);
			showSupportButtons = true;
		}
	}

	const date = new Date(createdAt);

	return (
		<FormCard title={'New Lightning Channel'} showLightningIcon>
			<Heading>{heading}</Heading>
			<div className={'order-state-container'}>
				<p className={'order-state-message'}>{headerMessage}</p>
				<IconRing icon={icon} type={iconState} showCross={showIconCross} />

				{showSupportButtons ? (
					<div className={'order-state-support-button-container'}>
						<SupportButton orderId={order.id} size={'sm'} />
						<span className={'order-state-support-button-spacer'} />
						<ActionButton onClick={() => dispatch(navigate({ page: 'configure' }))} size={'sm'}>
							New channel
						</ActionButton>
					</div>
				) : null}

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
					<ValueGroup label={'Inbound capacity'} value={lspBalanceSat} showFiat />
					<ValueGroup label={'My balance'} value={clientBalanceSat} showFiat />
				</div>

				{footerMessage ? (
					<p className={'order-state-message'}>
						{footerMessage} <br />
						Order ID: {order.id}
					</p>
				) : null}
			</div>
		</FormCard>
	);
}

export default OrderPage;
