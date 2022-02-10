import React, { useEffect } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { refreshInfo, selectInfo, selectInfoState } from '../../store/store';
import { Link } from 'react-router-dom';

function HomePage(): JSX.Element {
	const { node_info, services, capacity } = useAppSelector(selectInfo);
	const state = useAppSelector(selectInfoState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(refreshInfo()).catch((e) => alert(e));
	}, []);

	return (
		<div>
			<h1>Home</h1>

			<Button onClick={() => dispatch(refreshInfo())} disabled={state === 'loading'}>
				{state === 'loading' ? 'Loading...' : 'Refresh Info'}
			</Button>

			<br />
			<br />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Card.Title>Node Info</Card.Title>
							<Card.Text>Public key: {node_info.public_key}</Card.Text>
							<Card.Text>Alias: {node_info.alias}</Card.Text>
							<Card.Text>Active channels: {node_info.active_channels_count}</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card>
						<Card.Body>
							<Card.Title>Capacity</Card.Title>
							<Card.Text>Local balance: {capacity.local_balance}</Card.Text>
							<Card.Text>Remote balance: {capacity.remote_balance}</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<br />
			<h2>Services:</h2>
			{services.map((service) => {
				const {
					product_id,
					description,
					min_chan_expiry,
					max_chan_expiry,
					max_channel_size,
					min_channel_size,
					order_states,
					available
				} = service;

				return (
					<Row key={product_id}>
						<Col>
							<Card>
								<Card.Body>
									<Card.Title>
										{description} ({available ? 'Available' : 'Unavailable'})
									</Card.Title>
									<Card.Text>Max channel size: {max_channel_size}</Card.Text>
									<Card.Text>Min channel size: {min_channel_size}</Card.Text>

									<Card.Text>Max channel expiry: {max_chan_expiry}</Card.Text>
									<Card.Text>Min channel expiry: {min_chan_expiry}</Card.Text>
								</Card.Body>
								<Card.Footer>
									<Link to={`/?product_id=${product_id}`} className='nav-link'>
										<Button>Buy {description}</Button>
									</Link>
								</Card.Footer>
							</Card>
						</Col>
					</Row>
				);
			})}
		</div>
	);
}

export default HomePage;
