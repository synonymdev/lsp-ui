import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import bt, { IBuyChannelRequest, IService } from '@synonymdev/blocktank-client';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshInfo, selectInfo, selectInfoState } from '../../../store/cr';
import Spinner from '../../../components/spinner';
import FormCard from '../../../components/form-card';
import './index.scss';

function BuyPage(): JSX.Element {
	const { services } = useAppSelector(selectInfo);
	const infoState = useAppSelector(selectInfoState);
	const history = useHistory();

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [product, setProduct] = useState<IService | undefined>(undefined);
	const [channelExpiry, setChannelExpiry] = useState<string>('1');
	const [localBalance, setLocalBalance] = useState<string>('0');
	const [remoteBalance, setRemoteBalance] = useState<string>('0');

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

	const onBuy = async(e): Promise<void> => {
		e.preventDefault();

		if (!product) {
			return;
		}

		// TODO check channel balance

		if (Number(channelExpiry) < 1) {
			alert(`Minimum channel expiry is 1 week`);
		}

		if (Number(localBalance) !== 0 && Number(localBalance) < product.min_channel_size) {
			alert(`Local balance needs to be bigger than ${product.min_channel_size}`);
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

			history.push(`/order/${order_id}`);
		} catch (error) {
			setIsSubmitting(false);
			alert(error);
		}
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

	const refreshButton = (
		<Button onClick={() => dispatch(refreshInfo())} disabled={infoState === 'loading'}>
			{infoState === 'loading' ? 'Loading...' : 'Try again'}
		</Button>
	);

	if (isLoading) {
		return <Spinner style={{ fontSize: 8 }} />;
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
			<div>
				<h1>{description} not available</h1>
				{refreshButton}
			</div>
		);
	}

	return (
		<FormCard>
			<Form>
				<h4>Create Channel</h4>
				<Form.Group>
					<Form.Label>Remote balance</Form.Label>
					<Form.Control
						type='number'
						value={remoteBalance}
						onChange={(e) => onSetInput(e, setRemoteBalance)}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Local balance</Form.Label>
					<Form.Control
						type='number'
						value={localBalance}
						onChange={(e) => onSetInput(e, setLocalBalance)}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Channel expiry (Weeks)</Form.Label>
					<Form.Control
						type='number'
						value={channelExpiry}
						onChange={(e) => onSetInput(e, setChannelExpiry)}
					/>
				</Form.Group>

				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button className={'form-button'} onClick={onBuy} type='submit' disabled={isSubmitting}>
						Pay Now
					</Button>
				</div>
			</Form>
		</FormCard>
	);
}

export default BuyPage;
