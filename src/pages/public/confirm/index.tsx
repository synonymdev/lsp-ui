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

	const { lspBalanceSat, clientBalanceSat, channelExpiryWeeks, feeSat, state } = order;

	// If order expires while waiting for payment
	if (state === 'expired') {
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
					<ValueGroup label={'Inbound capacity'} value={lspBalanceSat} showFiat={true} />
					<ValueGroup label={'My balance'} value={clientBalanceSat} showFiat={true} />
				</div>

				<ChannelBalanceBar local={clientBalanceSat} remote={lspBalanceSat} />

				<p className={'confirmation-message'}>
					This channel may close automatically after{' '}
					<span className={'confirmation-message-highlight'}>
						{channelExpiryWeeks} week
						{channelExpiryWeeks > 1 ? 's' : ''}
					</span>
					.
				</p>

				<Divider />

				<ValueGroup label={'Total amount to pay'} value={feeSat} showFiat showBitcoin size={'lg'} />

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
						terms of service
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
