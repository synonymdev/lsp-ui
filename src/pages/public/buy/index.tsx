import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshInfo, selectInfo, selectInfoState } from '../../../store/cr';
import bt, { IBuyChannelRequest, IService } from '@synonymdev/blocktank-client';
import FormCard from '../../../components/form-card';
import './index.scss';

function BuyPage(): JSX.Element {
	const { services } = useAppSelector(selectInfo);
	const infoState = useAppSelector(selectInfoState);
	const history = useHistory();

	const [product, setProduct] = useState<IService | undefined>(undefined);
	const [channelExpiry, setChannelExpiry] = useState<string>('1');
	const [localBalance, setLocalBalance] = useState<string>('0');
	const [remoteBalance, setRemoteBalance] = useState<string>('0');

	useEffect(() => {
		if (services.length > 0) {
			const service = services[0];

			setProduct(service);

			if (localBalance === '0') {
				setLocalBalance(`${service.min_channel_size}`);
			}

			if (channelExpiry === '1') {
				setChannelExpiry(`${service.max_chan_expiry}`);
			}
		}
	}, [services]);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(refreshInfo()).catch((e) => alert(e));
	}, []);

	const onBuy = async(e): Promise<void> => {
		e.preventDefault();
		const req: IBuyChannelRequest = {
			product_id: product!.product_id,
			channel_expiry: Number(channelExpiry),
			local_balance: Number(localBalance),
			remote_balance: Number(remoteBalance)
		};

		console.log(req);

		try {
			const buyRes = await bt.buyChannel(req);
			const { order_id } = buyRes;

			history.push(`/order/${order_id}`);
		} catch (error) {
			alert(error);
		}
	};

	const refreshButton = (
		<Button onClick={() => dispatch(refreshInfo())} disabled={infoState === 'loading'}>
			{infoState === 'loading' ? 'Loading...' : 'Try again'}
		</Button>
	);

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
		<Form>
			<h4>Create Channel</h4>
			<Form.Group>
				<Form.Label>Local balance</Form.Label>
				<Form.Control
					type='number'
					value={localBalance}
					onChange={(e) => setLocalBalance(e.target.value)}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Remote balance</Form.Label>
				<Form.Control
					type='number'
					value={remoteBalance}
					onChange={(e) => setRemoteBalance(e.target.value)}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Channel expiry (Weeks)</Form.Label>
				<Form.Control
					type='number'
					value={channelExpiry}
					onChange={(e) => setChannelExpiry(e.target.value)}
				/>
			</Form.Group>

			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Button className={'form-button'} onClick={onBuy} type='submit'>
					Pay Now
				</Button>
			</div>
		</Form>
	);
}

export default BuyPage;
