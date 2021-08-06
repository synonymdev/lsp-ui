import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { refreshOrder, selectOrders, selectOrdersState } from '../store/cr';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function OrdersPage(): JSX.Element {
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	return (
		<Container>
			<h1>Orders</h1>

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
						const {
							_id,
							state,
							amount_received,
							onchain_payments,
							channel_expiry_ts,
							created_at,
							order_expiry,
							lnurl,
							local_balance,
							remote_balance,
							price,
							purchase_invoice,
							stateMessage
						} = order;

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
