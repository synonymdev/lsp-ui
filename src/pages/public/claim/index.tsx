import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, Link, useHistory, useRouteMatch } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshOrder, selectOrders, selectOrdersState } from '../../../store/public-store';
import bt, { IGetOrderResponse } from '@synonymdev/blocktank-client';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import QRCode from '../../../components/qr';
import InputGroup from '../../../components/input-group';
import Divider from '../../../components/divider';

import './index.scss';
import Heading from '../../../components/heading';
import Tooltip from '../../../components/tooltip';
import { clipCenter } from '../../../utils/helpers';
import ActionButton from '../../../components/action-button';
import { ReactComponent as LightningIconActive } from '../../../icons/lightning-active.svg';
import { ReactComponent as ClaimIcon } from '../../../icons/claim-white.svg';
import { ReactComponent as QRIcon } from '../../../icons/qr-white.svg';
import { ReactComponent as LightningIcon } from '../../../icons/lightning-white.svg';
import useDisplayValues from '../../../hooks/displayValues';

const qrSize = 200;

function ClaimPage(): JSX.Element {
	const { orderId } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [order, setOrder] = useState<IGetOrderResponse | undefined>(undefined);
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();
	const history = useHistory();

	const [showManual, setShowManual] = useState(false);
	const [nodeUri, setNodeUri] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	const inboundDisplay = useDisplayValues(Number(order?.local_balance));
	const myBalanceDisplay = useDisplayValues(Number(order?.remote_balance));

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

	const { _id, lnurl_string, remote_balance, local_balance, channel_expiry } = order;

	const claimChannel = async (): Promise<void> => {
		setIsSubmitting(true);
		try {
			await bt.finalizeChannel({
				order_id: _id,
				node_uri: nodeUri
			});

			await dispatch(refreshOrder(_id));

			history.push(`/order/${_id}`);
		} catch (e) {
			alert(e);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSetNodeUri = (e: React.ChangeEvent<any>): void => setNodeUri(e.target.value);

	const autoClaim = (
		<>
			<div className='claim-channel-top'>
				<div className={'claim-channel-qr'}>
					<QRCode value={lnurl_string} size={qrSize} />
				</div>
				<div className={'claim-channel-details'}>
					<div className={'claim-channel-title'}>
						<span>Channel claim url</span>
						<Tooltip
							tip={{
								title: 'How to claim',
								body: 'Scan this QR code with a supported Lightning wallet with node capability. Or, copy the claim text and paste it within your full Lightning node. You may also claim the channel manually.'
							}}
						/>
					</div>
					<p className={'claim-channel-address'}>{clipCenter(lnurl_string, 42)}</p>
					<div>
						<ActionButton copyText={lnurl_string}>Copy claim url</ActionButton>
						<div className={'claim-channel-button-spacer'} />
						<ActionButton onClick={() => setShowManual(true)} Icon={ClaimIcon}>
							Claim manually
						</ActionButton>
					</div>
				</div>
			</div>
		</>
	);

	const manualClaim = (
		<>
			<InputGroup
				type='text'
				value={nodeUri}
				onChange={onSetNodeUri}
				id={'node-uri'}
				placeholder={'nodeid@ip:port'}
				label={'Node URI'}
				// error={formErrors.remoteBalance}
				tooltip={{
					title: 'How to claim manually',
					body: 'Paste your node ID, IP, and port information here to initiate the channel connection manually.'
				}}
			/>
			<div className={'claim-channel-manual-action-buttons-container'}>
				<ActionButton onClick={claimChannel} Icon={LightningIcon}>
					{isSubmitting ? 'Opening channel...' : 'Open channel'}
				</ActionButton>
				<div className={'claim-channel-button-spacer'} />
				<ActionButton onClick={() => setShowManual(false)} Icon={QRIcon}>
					Claim automatically
				</ActionButton>
			</div>
			<Divider />
		</>
	);

	return (
		<FormCard
			title={'New Lightning Channel'}
			backlink={'/'}
			pageIndicator={{ total: 4, active: 3 }}
		>
			<Heading>{showManual ? 'Claim manually' : 'Claim channel'}</Heading>
			<Divider />
			<div className='claim-channel-container'>
				{showManual ? manualClaim : autoClaim}
				<div className={'claim-channel-middle'}>
					<div className={'claim-channel-middle-col'}>
						<div className={'claim-channel-title-container'}>
							<span className={'claim-channel-title'}>Inbound capacity</span>
							<span className={'channel-claim-fiat-conversion'}>
								${inboundDisplay.fiatWhole}
								<span className={'decimal'}>
									{inboundDisplay.fiatDecimal}
									{inboundDisplay.fiatDecimalValue}
								</span>
							</span>
						</div>
						<span className={'claim-channel-middle-value'}>
							<LightningIconActive className={'claim-channel-middle-value-icon'} />
							{local_balance}
						</span>
					</div>
					<div className={'claim-channel-middle-col'}>
						<div className={'claim-channel-title-container'}>
							<span className={'claim-channel-title'}>My balance</span>
							<span className={'channel-claim-fiat-conversion'}>
								${myBalanceDisplay.fiatWhole}
								<span className={'decimal'}>
									{myBalanceDisplay.fiatDecimal}
									{myBalanceDisplay.fiatDecimalValue}
								</span>
							</span>
						</div>
						<span className={'claim-channel-middle-value'}>
							<LightningIconActive className={'claim-channel-middle-value-icon'} />
							{remote_balance}
						</span>
					</div>
				</div>

				<p className={'claim-channel-bottom-message'}>
					This channel will stay open for at least{' '}
					<span className={'highlight'}>
						{channel_expiry} week
						{channel_expiry !== 1 ? 's' : ''}
					</span>
					.
				</p>
			</div>
		</FormCard>
	);
}

export default ClaimPage;
