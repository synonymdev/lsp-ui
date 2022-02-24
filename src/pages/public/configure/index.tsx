import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import bt, { IBuyChannelRequest, IService } from '@synonymdev/blocktank-client';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshInfo, selectInfo, selectInfoState, navigate } from '../../../store/public-store';
import Spinner from '../../../components/spinner';
import FormCard from '../../../components/form-card';
import './index.scss';
import InputGroup from '../../../components/input-group';
import Heading from '../../../components/heading';
import { TooltipProps } from '../../../components/tooltip';
import ErrorPage from '../error';

export type IFormErrors = {
	[key: string]: string;
};

const inboundTip: TooltipProps = {
	title: 'Inbound capacity',
	body: 'This is the amount of sats you will be able to receive in payments. The amount must be at least double the amount of your ‘spending balance’. The maximum amount of inbound capacity is 50,000,000 sats.'
};

const spendingTip: TooltipProps = {
	title: 'My spending balance',
	body: 'This is the amount of sats you can spend when you first open this channel. The maximum is the current equivalent of $9999.'
};

const durationTip: TooltipProps = {
	title: 'Channel duration',
	body: 'This is the minimum amount of time that your channel will remain open. We may choose to keep it open longer, but you can close your channel any time.'
};

function ConfigurePage(): JSX.Element {
	const { services } = useAppSelector(selectInfo);
	const infoState = useAppSelector(selectInfoState);
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(true);
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

		if (!(await isValid())) {
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

			dispatch(navigate({ page: 'confirm', orderId: order_id }));
		} catch (error) {
			setIsSubmitting(false);
			alert(error);
		}
	};

	const isValid = async (): Promise<boolean> => {
		await new Promise((resolve) => setTimeout(resolve, 250));

		if (!product) {
			return true;
		}

		const errors: IFormErrors = {};

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
		return <ErrorPage type={'geoblocked'} />;
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
		<FormCard title={'New Lightning Channel'} pageIndicator={{ total: 4, active: 0 }}>
			<Form className={'form-content'}>
				<div className={'form-fields'}>
					<Heading>Configure</Heading>

					<InputGroup
						type='number'
						value={remoteBalance}
						onChange={(e) => onSetInput(e, setRemoteBalance)}
						id={'remote-balance'}
						label={'Remote balance'}
						append={'sats'}
						showFiatFromSatsValue
						error={formErrors.remoteBalance}
						onBlur={onBlur}
						tooltip={inboundTip}
					/>

					<InputGroup
						type='number'
						value={localBalance}
						onChange={(e) => onSetInput(e, setLocalBalance)}
						id={'local-balance'}
						label={'Local balance'}
						append={'sats'}
						showFiatFromSatsValue
						error={formErrors.localBalance}
						onBlur={onBlur}
						tooltip={spendingTip}
					/>

					<InputGroup
						type='number'
						value={channelExpiry}
						onChange={(e) => onSetInput(e, setChannelExpiry)}
						id={'channel-expiry'}
						label={'Channel expiry'}
						append={'weeks'}
						error={formErrors.channelExpiry}
						onBlur={onBlur}
						tooltip={durationTip}
					/>
				</div>

				<div className={'button-container'}>
					<div>
						<Button className={'form-button'} onClick={onBuy} type='submit' disabled={isSubmitting}>
							Create my Channel
						</Button>
					</div>
				</div>
			</Form>
		</FormCard>
	);
}

export default ConfigurePage;
