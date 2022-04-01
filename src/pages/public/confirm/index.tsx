import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useAppDispatch } from '../../../store/hooks';
import { navigate } from '../../../store/public-store';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import Heading from '../../../components/heading';
import ValueGroup from '../../../components/value-group';
import ChannelBalanceBar from '../../../components/channel-balance-bar';
import Divider from '../../../components/divider';
import Checkbox from '../../../components/checkbox';

import './index.scss';
import ErrorPage from '../error';
import useOrder from '../../../hooks/useOrder';

function ConfirmationPage(): JSX.Element {
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [showAcceptTermsError, setShowAcceptTermsError] = useState(false);
	const dispatch = useAppDispatch();
	const { order, orderState } = useOrder();

	if (!order) {
		if (orderState === 'loading') {
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

		dispatch(navigate({ page: 'payment' }));
	};

	const { local_balance, remote_balance, channel_expiry, total_amount, state } = order;

	// If order expires while waiting for payment
	if (state === 410) {
		dispatch(navigate({ page: 'order' }));
	}

	return (
		<FormCard
			title={'New Lightning Channel'}
			backPage={'configure'}
			pageIndicator={{ total: 4, active: 1 }}
			showLightningIcon
		>
			<Heading>Review channel</Heading>

			<div className={'confirmation-top-half'}>
				<div className={'confirmation-value-groups'}>
					<ValueGroup label={'Inbound capacity'} value={local_balance} showFiat={true} />
					<ValueGroup label={'My balance'} value={remote_balance} showFiat={true} />
				</div>

				<ChannelBalanceBar local={remote_balance} remote={local_balance} />

				<p className={'confirmation-message'}>
					This channel may close automatically after{' '}
					<span className={'confirmation-message-highlight'}>
						{channel_expiry} week
						{channel_expiry > 1 ? 's' : ''}
					</span>
					.
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
