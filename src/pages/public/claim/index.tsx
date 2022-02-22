import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
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
import { ReactComponent as ClaimIcon } from '../../../icons/claim.svg';

const qrSize = 200;

function ClaimPage(): JSX.Element {
	const { orderId } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [order, setOrder] = useState<IGetOrderResponse | undefined>(undefined);
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

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
		} catch (e) {
			alert(e);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSetNodeUri = (e: React.ChangeEvent<any>): void => setNodeUri(e.target.value);

	return (
		<FormCard
			title={'New Lightning Channel'}
			backlink={'/'}
			pageIndicator={{ total: 4, active: 3 }}
		>
			<Heading>Pay now</Heading>
			<Divider />
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
				<div className='claim-channel-container'>
					<div className='claim-channel-top'>
						<div className={'claim-channel-qr'}>
							<QRCode value={lnurl_string} size={qrSize} />
						</div>
						<div className={'claim-channel-details'}>
							<div className={'claim-channel-title'}>
								<span>Channel claim url</span>
								<Tooltip
									tip={{
										title: 'todo',
										body: 'todo.'
									}}
								/>
							</div>
							<p className={'claim-channel-address'}>{clipCenter(lnurl_string, 42)}</p>
							<ActionButton copyText={lnurl_string}>Copy claim url</ActionButton>
							<div className={'claim-channel-button-spacer'}/>
							<ActionButton onClick={() => setShowManual(true)} Icon={ClaimIcon}>Claim manually</ActionButton>
						</div>
					</div>

					<div className={'claim-channel-middle'}>
						<div>
							<h4 className={'claim-channel-title'}>Inbound capacity</h4>
							<span className={'claim-channel-middle-value'}>
								<LightningIconActive className={'claim-channel-middle-value-icon'} />
								{local_balance}
							</span>
						</div>
						<div>
							<h4 className={'claim-channel-title'}>My balance</h4>
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
			)}

			{/* <span className={'link'} onClick={() => setShowManual(!showManual)}> */}
			{/*	{showManual ? 'Automatic claim' : 'Manual channel claim'} */}
			{/* </span> */}
		</FormCard>
	);
}

export default ClaimPage;
