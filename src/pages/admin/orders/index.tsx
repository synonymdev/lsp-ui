import React, { useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {
	refreshOrders,
	selectAuth,
	selectOrders,
	selectOrdersState
} from '../../../store/admin-store';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import OrderStateFilterDropdown from '../../../components/admin/order-state-filter-dropdown';

function OrdersPage(): JSX.Element {
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();
	const authStatus = useAppSelector(selectAuth);

	useEffect(() => {
		dispatch(refreshOrders());
	}, []);

	useEffect(() => {
		if (authStatus.authenticated && ordersState === 'error') {
			dispatch(refreshOrders());
		}
	}, [authStatus]);

	return (
		<Container>
			<h1>Orders</h1>
			<pre>Orders state: {ordersState}</pre>
			<Button
				variant='primary'
				onClick={async () => {
					try {
						await dispatch(refreshOrders());
					} catch (e) {
						alert(e);
					}
				}}
			>
				Refresh orders
			</Button>
			&nbsp;
			<OrderStateFilterDropdown />
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
									<Link to={`/admin/order/${_id}`}>Details</Link>
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
