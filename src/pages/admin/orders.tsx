import React, { useState } from 'react';
import { Container, Table, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { refreshOrder, selectOrders, selectOrdersState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

function OrdersPage(): JSX.Element {
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	const [search, setSearch] = useState('');

	return (
		<Container>
			<h1>Orders</h1>
			<Form>
				<Form.Group as={Row}>
					<Col>
						<Form.Control
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Order ID'
						/>
					</Col>
					<Col>
						<Button
							variant='primary'
							onClick={async () => {
								try {
									await dispatch(refreshOrder(search));
								} catch (e) {
									alert(e);
								}
							}}
						>
							Find
						</Button>
					</Col>
				</Form.Group>
			</Form>

			<Table striped bordered hover size='sm'>
				<thead>
					<tr>
						<th>Date</th>
						<th>Price</th>
						<th>Amount received</th>
						<th>State</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{orders.map((order) => {
						const { _id, amount_received, created_at, price, stateMessage } = order;

						return (
							<tr key={_id}>
								<td>{new Date(created_at).toLocaleDateString()}</td>
								<td>{price}</td>
								<td>{amount_received}</td>
								<td>{stateMessage}</td>
								<td>
									<Link to={`/order/${_id}`}>Details</Link>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</Container>
	);
}

export default OrdersPage;
