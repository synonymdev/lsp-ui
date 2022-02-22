import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, Link, useHistory } from 'react-router-dom';
import { IGetOrderResponse } from '@synonymdev/blocktank-client';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshOrder, selectOrders, selectOrdersState } from '../../../store/public-store';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import Heading from '../../../components/heading';
import ValueGroup from '../../../components/value-group';
import ChannelBalanceBar from '../../../components/channel-balance-bar';
import Divider from '../../../components/divider';
import Checkbox from '../../../components/checkbox';
import RatesRefresher from '../../../hooks/ratesRefresher';

import './index.scss';

function ConfirmationPage(): JSX.Element {
	const { orderId } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [order, setOrder] = useState<IGetOrderResponse | undefined>(undefined);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [showAcceptTermsError, setShowAcceptTermsError] = useState(false);
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();
	const history = useHistory();

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

		return (
			<FormCard>
				<h4>Order not found</h4>
				<div className={'button-container'}>
					<Link to={'/'}>
						<Button className={'form-button'}>Home</Button>
					</Link>
				</div>
			</FormCard>
		);
	}

	const onPay = (): void => {
		if (!termsAccepted) {
			return setShowAcceptTermsError(true);
		}

		// TODO check order is still valid

		history.push(`/payment/${orderId}`);
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
			backlink={'/'}
			pageIndicator={{ total: 4, active: 1 }}
		>
			<RatesRefresher />
			<Heading>My Channel</Heading>

			<div className={'confirmation-top-half'}>
				<div className={'confirmation-value-groups'}>
					<ValueGroup label={'Inbound capacity'} value={remote_balance} showFiat={true} />
					<ValueGroup label={'My balance'} value={local_balance} showFiat={true} />
				</div>

				<ChannelBalanceBar local={local_balance} remote={remote_balance} />

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
