import React, { useEffect } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshInfo, selectInfo, selectInfoState } from '../../../store/public-store';

function HomePage(): JSX.Element {
	const { nodes, options, version } = useAppSelector(selectInfo);
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
							<Card.Text>Public key: {nodes[0].pubkey}</Card.Text>
							<Card.Text>Alias: {nodes[0].alias}</Card.Text>
							<Card.Text>Active channels: {nodes[0].connectionStrings}</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card>
						<Card.Body>
							<Card.Title>version</Card.Title>
							<Card.Text>{version}</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<br />
			<h2>Options:</h2>
			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Card.Title>Capability</Card.Title>
							<Card.Text>Max channel size: {options.maxChannelSizeSat}</Card.Text>
							<Card.Text>Min channel size: {options.minChannelSizeSat}</Card.Text>

							<Card.Text>Max channel expiry: {options.maxExpiryWeeks}</Card.Text>
							<Card.Text>Min channel expiry: {options.minExpiryWeeks}</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}

export default HomePage;
