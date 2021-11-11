import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { refreshInfo, selectInfo, selectInfoState } from '../../store/cr';
import bt, { IBuyChannelRequest, IService } from '@synonymdev/blocktank-client';

function BuyPage(): JSX.Element {
	const { productId } = useParams();
	const { services } = useAppSelector(selectInfo);
	const infoState = useAppSelector(selectInfoState);
	const history = useHistory();

	const [product, setProduct] = useState<IService | undefined>(undefined);
	const [channelExpiry, setChannelExpiry] = useState<string>('1');
	const [localBalance, setLocalBalance] = useState<string>('0');
	const [remoteBalance, setRemoteBalance] = useState<string>('0');

	useEffect(() => {
		const service = services.find((s) => s.product_id === productId);
		if (service) {
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

	const onBuy = async (e): Promise<void> => {
		e.preventDefault();
		const req: IBuyChannelRequest = {
			product_id: productId,
			channel_expiry: Number(channelExpiry),
			local_balance: Number(localBalance),
			remote_balance: Number(remoteBalance)
		};

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
			{infoState === 'loading' ? 'Loading...' : 'Refresh service'}
		</Button>
	);

	if (!product) {
		return (
			<div>
				<h1>Service not found</h1>
				{refreshButton}
			</div>
		);
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
		<div>
			<h1>Buy {description}</h1>
			<br />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Card.Text>Max channel size: {max_channel_size}</Card.Text>
							<Card.Text>Min channel size: {min_channel_size}</Card.Text>
							<Card.Text>Max channel expiry: {max_chan_expiry}</Card.Text>
							<Card.Text>Min channel expiry: {min_chan_expiry}</Card.Text>
						</Card.Body>
						<Card.Footer>{refreshButton}</Card.Footer>
					</Card>
				</Col>
			</Row>

			<br />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Form>
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
									<Form.Label>Channel expiry</Form.Label>
									<Form.Control
										type='number'
										value={channelExpiry}
										onChange={(e) => setChannelExpiry(e.target.value)}
									/>
								</Form.Group>

								<Button onClick={onBuy} variant='primary' type='submit'>
									Buy
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}

export default BuyPage;
