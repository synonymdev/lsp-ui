import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { IGetOrderResponse } from '@synonymdev/blocktank-client';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
	navigate,
	refreshOrder,
	selectCurrentOrderId,
	selectOrders,
	selectOrdersState
} from '../../../store/public-store';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import Heading from '../../../components/heading';
import ValueGroup from '../../../components/value-group';
import ChannelBalanceBar from '../../../components/channel-balance-bar';
import Divider from '../../../components/divider';
import Checkbox from '../../../components/checkbox';

import './index.scss';
import ErrorPage from '../error';

function ConfirmationPage(): JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
	const orderId = useAppSelector(selectCurrentOrderId);
	const [order, setOrder] = useState<IGetOrderResponse | undefined>(undefined);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [showAcceptTermsError, setShowAcceptTermsError] = useState(false);
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	// TODO move to reusable hook
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

	const onPay = (): void => {
		if (!termsAccepted) {
			return setShowAcceptTermsError(true);
		}

		// TODO check order is still valid

		dispatch(navigate({ page: 'payment' }));
	};

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

	return (
		<FormCard
			title={'New Lightning Channel'}
			backPage={'configure'}
			pageIndicator={{ total: 4, active: 1 }}
			showLightningIcon
		>
			<Heading>My Channel</Heading>

			<div className={'confirmation-top-half'}>
				<div className={'confirmation-value-groups'}>
					<ValueGroup label={'Inbound capacity'} value={local_balance} showFiat={true} />
					<ValueGroup label={'My balance'} value={remote_balance} showFiat={true} />
				</div>

				<ChannelBalanceBar local={remote_balance} remote={local_balance} />

				<p className={'confirmation-message'}>
					This channel may close automatically after {channel_expiry} week
					{channel_expiry > 1 ? 's' : ''}.
				</p>

				<Divider />

				<ValueGroup
					label={'Total amount to pay'}
					value={total_amount}
					showFiat
					showBitcoin
					size={'lg'}
				/>

				<p className={'confirmation-message'}>
					This total includes a small fee for setting up the channel. It does not include the cost
					for your Lightning or on-chain transaction. For more information about cost see our terms
					& conditions.
				</p>

				<Checkbox
					isChecked={termsAccepted}
					setIsChecked={(isChecked) => {
						setTermsAccepted(isChecked);
						setShowAcceptTermsError(false);
					}}
					error={showAcceptTermsError ? 'Please accept the terms and conditions' : ''}
				>
					<span>I accept the </span>
					<a target={'_blank'} className={'link'} href={'/terms-and-conditions'}>
						terms and conditions
					</a>
				</Checkbox>
			</div>

			<div className={'pay-now-button-container'}>
				<Button className={'form-button'} onClick={onPay}>
					Pay now
				</Button>
			</div>
		</FormCard>
	);
}

export default ConfirmationPage;
