import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BlocktankClient } from '@synonymdev/blocktank-lsp-http-client';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
	refreshInfo,
	selectInfo,
	navigate,
	refreshOrder,
	selectExchangeRates,
	selectCurrency
} from '../../../store/public-store';
import Spinner from '../../../components/spinner';
import FormCard from '../../../components/form-card';
import './index.scss';
import InputGroup from '../../../components/input-group';
import Heading from '../../../components/heading';
import { TooltipProps } from '../../../components/tooltip';
import Error from '../../../components/inline-error';
import { numberWithSpaces, currencySymbols } from '../../../utils/helpers';

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
	const { options } = useAppSelector(selectInfo);
	const dispatch = useAppDispatch();
	const exchangeRates = useAppSelector(selectExchangeRates);
	const selectedCurrency = useAppSelector(selectCurrency);
	const API_URL = process.env.API_URL;
	const client = new BlocktankClient(API_URL);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [product, setProduct] = useState<{} | undefined>(undefined);
	const [channelExpiry, setChannelExpiry] = useState<string>('');
	const [localBalance, setLocalBalance] = useState<string>('');
	const [remoteBalance, setRemoteBalance] = useState<string>('0');
	const [formErrors, setFormErrors] = useState<IFormErrors>({});
	const [generalError, setGeneralError] = useState('');
	const initChannelSize = 1000000;
	const coupon_code = 'blocktank-widget';

	useEffect(() => {
		if (options) {
			setProduct(options);
			setIsLoading(false);

			if (remoteBalance === '0') {
				if (options.minChannelSizeSat < initChannelSize) {
					setRemoteBalance('1000000');
				} else {
					setRemoteBalance(`${options.minChannelSizeSat}`);
				}
			}

			if (localBalance === '0') {
				// setLocalBalance(`${service.min_channel_size}`);
			}
		}
	}, [options]);

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

		const max_chan_expiry = options.maxExpiryWeeks;

		const channel_expiry = channelExpiry ? Number(channelExpiry) : max_chan_expiry;
		const local_balance = Number(remoteBalance);
		const remote_balance = localBalance ? Number(localBalance) : 0;

		try {
			const order = await client.createOrder(local_balance, channel_expiry, {
				clientBalanceSat: remote_balance,
				couponCode: coupon_code
			});
			const order_id = order.id;

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

		const max_chan_receiving = Math.floor(options.maxChannelSizeSat);
		const min_chan_receiving = Math.floor(options.minChannelSizeSat);
		const max_chan_spending = Math.floor(options.maxClientBalanceSat);

		const bitcoinPrice = exchangeRates[selectedCurrency];
		const symbolCurrency = currencySymbols[selectedCurrency];

		const max_chan_receiving_cur = Math.floor((max_chan_receiving / 100000000) * bitcoinPrice);
		const min_chan_receiving_cur = Math.floor((min_chan_receiving / 100000000) * bitcoinPrice);
		const initChannelSize_cur = Math.floor((initChannelSize / 100000000) * bitcoinPrice);
		const max_chan_spending_cur = Math.floor((max_chan_spending / 100000000) * bitcoinPrice);

		const errors: IFormErrors = {};

		if (channelExpiry !== '' && Number(channelExpiry) < 1) {
			errors.channelExpiry = {
				message: `Minimum channel expiry is ${options.minExpiryWeeks} week${
					options.minExpiryWeeks !== 1 ? 's' : ''
				}`,
				value: options.minExpiryWeeks
			};
		} else if (Number(channelExpiry) > options.maxExpiryWeeks) {
			errors.channelExpiry = {
				message: `Maximum channel expiry is ${options.maxExpiryWeeks} weeks`,
				value: options.maxExpiryWeeks
			};
		}

		if (Number(remoteBalance) > max_chan_receiving) {
			errors.remoteBalance = {
				message: `Max receiving capacity is ${numberWithSpaces(
					max_chan_receiving
				)} sats (${symbolCurrency}${numberWithSpaces(max_chan_receiving_cur)})`,
				value: max_chan_receiving
			};
		} else if (min_chan_receiving < initChannelSize) {
			if (Number(remoteBalance) < initChannelSize) {
				errors.remoteBalance = {
					message: `Minimum receiving capacity is ${initChannelSize} sats (${symbolCurrency}${initChannelSize_cur})`,
					value: initChannelSize
				};
			}
		} else if (min_chan_receiving >= initChannelSize) {
			if (Number(remoteBalance) < min_chan_receiving) {
				errors.remoteBalance = {
					message: `Minimum receiving capacity is ${numberWithSpaces(
						min_chan_receiving
					)} sats (${symbolCurrency}${min_chan_receiving_cur})`,
					value: min_chan_receiving
				};
			}
		}

		if (Number(localBalance) !== 0) {
			if (Number(localBalance) > max_chan_spending) {
				errors.localBalance = {
					message: `Max spending balance is ${numberWithSpaces(
						max_chan_spending
					)} sats (${symbolCurrency}${max_chan_spending_cur})`,
					value: max_chan_spending
				};
			} else if (Number(localBalance) + Number(remoteBalance) > max_chan_receiving) {
				const max_spending_balance = max_chan_receiving - Number(remoteBalance);
				errors.localBalance = {
					message: `Total channel capacity is ${numberWithSpaces(
						max_chan_receiving
					)} sats (${symbolCurrency}${max_chan_receiving_cur})`,
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
						placeholder={`${options.maxExpiryWeeks}`}
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
