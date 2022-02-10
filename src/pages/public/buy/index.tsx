import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';
import bt, { IBuyChannelRequest, IService } from '@synonymdev/blocktank-client';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshInfo, selectInfo, selectInfoState } from '../../../store/store';
import Spinner from '../../../components/spinner';
import FormCard from '../../../components/form-card';
import PreviousOrdersLink from '../../../components/previous-orders-link';
import Checkbox from '../../../components/checkbox';
import './index.scss';
import RatesRefresher from '../../../hooks/ratesRefresher';
import InputGroup from '../../../components/input-group';

export type IFormErrors = {
	[key: string]: string;
};

function BuyPage(): JSX.Element {
	const { services } = useAppSelector(selectInfo);
	const infoState = useAppSelector(selectInfoState);
	const history = useHistory();
	const route = useRouteMatch();

	const [isLoading, setIsLoading] = useState(true);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [product, setProduct] = useState<IService | undefined>(undefined);
	const [channelExpiry, setChannelExpiry] = useState<string>('1');
	const [localBalance, setLocalBalance] = useState<string>('0');
	const [remoteBalance, setRemoteBalance] = useState<string>('0');
	const [formErrors, setFormErrors] = useState<IFormErrors>({});

	useEffect(() => {
		if (services.length > 0) {
			const service = services[0];

			setProduct(service);
			setIsLoading(false);

			if (remoteBalance === '0') {
				setRemoteBalance(`${service.min_channel_size}`);
			}

			if (localBalance === '0') {
				// setLocalBalance(`${service.min_channel_size}`);
			}

			if (channelExpiry === '1') {
				setChannelExpiry(`${service.max_chan_expiry}`);
			}
		}
	}, [services]);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(refreshInfo())
			.catch((e) => alert(e))
			.finally(() => setIsLoading(false));
	}, []);

	const onBuy = async (e): Promise<void> => {
		e.preventDefault();

		if (!product) {
			return;
		}

		if (!(await isValid(true))) {
			return;
		}

		setIsSubmitting(true);

		const req: IBuyChannelRequest = {
			product_id: product.product_id,
			channel_expiry: Number(channelExpiry),
			local_balance: Number(remoteBalance), // Switched around for context
			remote_balance: Number(localBalance)
		};

		try {
			const buyRes = await bt.buyChannel(req);
			const { order_id } = buyRes;

			history.push(`${route.url}order/${order_id}`);
		} catch (error) {
			setIsSubmitting(false);
			alert(error);
		}
	};

	const isValid = async (validateTermsCheckbox = false): Promise<boolean> => {
		await new Promise((resolve) => setTimeout(resolve, 250));

		if (!product) {
			return true;
		}

		const errors: IFormErrors = {};

		if (validateTermsCheckbox && !termsAccepted) {
			errors.acceptTerms = 'You must accept the terms and conditions';
		}

		// TODO check channel balance

		if (Number(channelExpiry) < 1) {
			errors.channelExpiry = `Minimum channel expiry is ${product.min_chan_expiry} week${
				product.min_chan_expiry !== 1 ? 's' : ''
			}`;
		} else if (Number(channelExpiry) > product.max_chan_expiry) {
			errors.channelExpiry = `Maximum channel expiry is ${product.max_chan_expiry} weeks`;
		}

		if (Number(remoteBalance) > product.max_channel_size) {
			errors.remoteBalance = `Max channel size must be smaller than ${product.max_channel_size}`;
		} else if (Number(remoteBalance) < product.min_channel_size) {
			errors.remoteBalance = `Min channel size must be greater than ${product.min_channel_size}`;
		}

		if (Number(localBalance) !== 0 && Number(localBalance) < product.min_channel_size) {
			errors.localBalance = `Local balance needs to be greater than ${product.min_channel_size}`;
		}

		setFormErrors(errors);

		return Object.keys(errors).length < 1;
	};

	// Updates the remoteBalance with a valid input if localBalance is updated
	useEffect(() => {
		if (!product) {
			return;
		}

		const rBalance = Number(remoteBalance);
		const lBalance = Number(localBalance);

		if (rBalance < lBalance + product.min_channel_size) {
			setRemoteBalance(`${lBalance + product.min_channel_size}`);
		}
	}, [localBalance]);

	const onSetInput = (e: React.ChangeEvent<any>, set: Function): void => {
		// Block negative numbers
		if (e.target.value && Number(e.target.value) < 0) {
			return;
		}

		set(e.target.value);
	};

	if (isLoading) {
		return <Spinner style={{ fontSize: 8 }} />;
	}

	if (infoState === 'geoblocked') {
		return (
			<FormCard>
				<h4>Unfortunately this feature is not available in your country</h4>
			</FormCard>
		);
	}

	if (!product) {
		return <div />;
	}

	const {
		available,
		max_channel_size,
		min_channel_size,
		max_chan_expiry,
		min_chan_expiry,
		order_states,
		description
	} = product;

	if (!available) {
		return (
			<FormCard>
				<h4>{description} not available</h4>
				<div className={'button-container'}>
					<Button
						className={'form-button'}
						onClick={() => dispatch(refreshInfo())}
						disabled={infoState === 'loading'}
					>
						Retry
					</Button>
				</div>
			</FormCard>
		);
	}

	const onBlur = (): void => {
		isValid()
			.then()
			.catch((e) => console.error(e));
	};

	return (
		<FormCard>
			<RatesRefresher />
			<Form className={'form-content'}>
				<div>
					<h4>Create Channel</h4>

					<InputGroup
						type='number'
						value={remoteBalance}
						onChange={(e) => onSetInput(e, setRemoteBalance)}
						id={'remote-balance'}
						label={'Remote balance'}
						append={'Sats'}
						showFiatFromSatsValue
						error={formErrors.remoteBalance}
						onBlur={onBlur}
					/>

					<InputGroup
						type='number'
						value={localBalance}
						onChange={(e) => onSetInput(e, setLocalBalance)}
						id={'local-balance'}
						label={'Local balance'}
						append={'Sats'}
						showFiatFromSatsValue
						error={formErrors.localBalance}
						onBlur={onBlur}
					/>

					<InputGroup
						type='number'
						value={channelExpiry}
						onChange={(e) => onSetInput(e, setChannelExpiry)}
						id={'channel-expiry'}
						label={'Channel expiry'}
						append={'Weeks'}
						error={formErrors.channelExpiry}
						onBlur={onBlur}
					/>

					<Checkbox
						isChecked={termsAccepted}
						setIsChecked={(isChecked) => {
							setTermsAccepted(isChecked);
							isValid(!isChecked).then();
						}}
						error={formErrors.acceptTerms}
					>
						<span>I accept the </span>
						<a target={'_blank'} className={'link'} href={'/terms-and-conditions'}>
							terms and conditions
						</a>
					</Checkbox>
				</div>
				<div className={'button-container'}>
					<Button className={'form-button'} onClick={onBuy} type='submit' disabled={isSubmitting}>
						Pay Now
					</Button>
				</div>
			</Form>
			<PreviousOrdersLink />
		</FormCard>
	);
}

export default BuyPage;
