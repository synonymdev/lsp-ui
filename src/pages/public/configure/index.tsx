import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import bt, { IBuyChannelRequest, IService } from '@synonymdev/blocktank-client';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
	refreshInfo,
	selectInfo,
	selectInfoState,
	navigate,
	refreshOrder
} from '../../../store/public-store';
import Spinner from '../../../components/spinner';
import FormCard from '../../../components/form-card';
import './index.scss';
import InputGroup from '../../../components/input-group';
import Heading from '../../../components/heading';
import { TooltipProps } from '../../../components/tooltip';
import ErrorPage from '../error';
import Error from '../../../components/inline-error';
import { numberWithSpaces } from '../../../utils/helpers';

export type IFormErrors = {
	[key: string]: any;
};

const inboundTip: TooltipProps = {
	title: 'My receiving capacity',
	body: 'This is the amount of sats you will be able to receive in payments. The amount must be at least double that of your ‘spending balance’. Maximum receiving capacity is 50 000 000 sats.'
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
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [product, setProduct] = useState<IService | undefined>(undefined);
	const [channelExpiry, setChannelExpiry] = useState<string>('');
	const [localBalance, setLocalBalance] = useState<string>('');
	const [remoteBalance, setRemoteBalance] = useState<string>('0');
	const [formErrors, setFormErrors] = useState<IFormErrors>({});
	const [generalError, setGeneralError] = useState('');

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
		}
	}, [services]);

	useEffect(() => {
		dispatch(refreshInfo())
			.catch((e) => setGeneralError(e.toString()))
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

		const { max_chan_expiry } = product;

		const req: IBuyChannelRequest = {
			product_id: product.product_id,
			channel_expiry: channelExpiry ? Number(channelExpiry) : max_chan_expiry,
			local_balance: Number(remoteBalance), // Switched around for context
			remote_balance: localBalance ? Number(localBalance) : 0
		};

		try {
			const buyRes = await bt.buyChannel(req);
			const { order_id } = buyRes;

			dispatch(refreshOrder(order_id))
				.then(() => {
					dispatch(navigate({ page: 'confirm', orderId: order_id }));
				})
				.catch((refreshError) => alert(refreshError));
		} catch (error: any) {
			setIsSubmitting(false);
			if (error.toString().indexOf('GEO_BLOCKED') > -1) {
				dispatch(navigate({ page: 'geoblocked' }));
			} else {
				setGeneralError(error.toString());
			}
		}
	};

	const isValid = async (): Promise<boolean> => {
		await new Promise((resolve) => setTimeout(resolve, 250));

		if (!product) {
			return true;
		}

		const { max_chan_receiving, max_chan_spending } = product;
		const max_chan_receiving_usd = Math.floor(product.max_chan_receiving_usd);
		const max_chan_spending_usd = Math.floor(product.max_chan_spending_usd);

		const errors: IFormErrors = {};

		if (channelExpiry !== '' && Number(channelExpiry) < 1) {
			errors.channelExpiry = {
				message: `Minimum channel expiry is ${product.min_chan_expiry} week${
					product.min_chan_expiry !== 1 ? 's' : ''
				}`,
				value: product.min_chan_expiry
			};
		} else if (Number(channelExpiry) > product.max_chan_expiry) {
			errors.channelExpiry = {
				message: `Maximum channel expiry is ${product.max_chan_expiry} weeks`,
				value: product.max_chan_expiry
			};
		}

		if (Number(remoteBalance) > max_chan_receiving) {
			errors.remoteBalance = {
				message: `Max receiving capacity is ${numberWithSpaces(
					max_chan_receiving
				)} sats ($${numberWithSpaces(max_chan_receiving_usd)})`,
				value: max_chan_receiving
			};
		} else if (Number(remoteBalance) < product.min_channel_size) {
			errors.remoteBalance = {
				message: `Minimum receiving capacity is ${numberWithSpaces(product.min_channel_size)} sats`,
				value: product.min_channel_size
			};
		}

		if (Number(localBalance) !== 0) {
			if (Number(localBalance) > max_chan_spending) {
				errors.localBalance = {
					message: `Max spending balance is ${numberWithSpaces(
						max_chan_spending
					)} sats ($${max_chan_spending_usd})`,
					value: max_chan_spending
				};
			} else if (Number(localBalance) + Number(remoteBalance) > product.max_channel_size) {
				const max_spending_balance = product.max_channel_size - Number(remoteBalance);
				errors.localBalance = {
					message: `Total channel capacity is ${numberWithSpaces(product.max_channel_size)} sats`,
					value: max_spending_balance
				};
			}
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

		// if (rBalance < lBalance + product.min_channel_size) {
		// 	setRemoteBalance(`${lBalance + product.min_channel_size}`); // TODO use new min field
		// }
	}, [localBalance]);

	const onSetInput = (str: string, set: Function): void => {
		// Block negative numbers
		set(str.replaceAll('-', ''));
	};

	if (isLoading) {
		return <Spinner style={{ fontSize: 8 }} />;
	}

	if (!product) {
		return <div />;
	}

	const { available, max_chan_expiry } = product;

	if (!available) {
		return <ErrorPage type={'unavailable'} />;
	}

	const onBlur = (): void => {
		// Remove decimal places
		if (remoteBalance) {
			setRemoteBalance(Math.trunc(Number(remoteBalance)).toString());
		}

		if (localBalance) {
			setLocalBalance(Math.trunc(Number(localBalance)).toString());
		}

		if (channelExpiry) {
			setChannelExpiry(Math.trunc(Number(channelExpiry)).toString());
		}

		setGeneralError('');

		isValid()
			.then()
			.catch((e) => console.error(e));
	};

	return (
		<FormCard
			title={'New Lightning Channel'}
			pageIndicator={{ total: 4, active: 0 }}
			showLightningIcon
		>
			<Form className={'form-content'}>
				<div className={'form-fields'}>
					<Heading>My channel</Heading>

					<InputGroup
						type='number'
						value={remoteBalance}
						onChange={(str) => onSetInput(str, setRemoteBalance)}
						id={'remote-balance'}
						label={'My receiving capacity'}
						append={'sats'}
						showFiatFromSatsValue
						error={formErrors.remoteBalance?.message}
						onErrorClick={() => {
							setRemoteBalance(Math.trunc(Number(formErrors.remoteBalance?.value)).toString());
							setFormErrors({});
						}}
						onBlur={onBlur}
						tooltip={inboundTip}
					/>

					<InputGroup
						type='number'
						value={localBalance}
						placeholder={'0'}
						onChange={(str) => onSetInput(str, setLocalBalance)}
						id={'local-balance'}
						label={'My spending balance'}
						append={'sats'}
						showFiatFromSatsValue
						error={formErrors.localBalance?.message}
						onErrorClick={() => {
							setLocalBalance(Math.trunc(Number(formErrors.localBalance?.value) - 1).toString());
							setFormErrors({});
						}}
						onBlur={onBlur}
						tooltip={spendingTip}
					/>

					<InputGroup
						type='number'
						value={channelExpiry}
						placeholder={`${max_chan_expiry}`}
						onChange={(str) => onSetInput(str, setChannelExpiry)}
						id={'channel-expiry'}
						label={'Keep my channel open for at least'}
						append={'weeks'}
						error={formErrors.channelExpiry?.message}
						onErrorClick={() => {
							setChannelExpiry(Math.trunc(Number(formErrors.channelExpiry?.value)).toString());
							setFormErrors({});
						}}
						onBlur={onBlur}
						tooltip={durationTip}
					/>

					<Error>{generalError}</Error>
				</div>

				<div className={'button-container'}>
					<div>
						<Button className={'form-button'} onClick={onBuy} type='submit' disabled={isSubmitting}>
							Create my channel
						</Button>
					</div>
				</div>
			</Form>
		</FormCard>
	);
}

export default ConfigurePage;
