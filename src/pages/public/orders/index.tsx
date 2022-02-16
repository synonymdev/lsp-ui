import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { refreshOrder, selectOrders, selectOrdersState } from '../../../store/public-store';
import LineItem from '../../../components/line-item';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import SupportLink from '../../../components/support-link';
import './index.scss';

function OrdersPage(): JSX.Element {
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		orders.forEach((o) => {
			console.log(`Refresh: ${o._id}`);
			dispatch(refreshOrder(o._id)).catch((e) => alert(e));
		});
	}, []);

	if (ordersState === 'loading') {
		return (
			<FormCard>
				<Spinner style={{ fontSize: 8 }} centered />
			</FormCard>
		);
	}

	return (
		<FormCard>
			<div className={'orders-container'}>
				<div>
					<h4>Orders</h4>
					{orders.map(({ _id, state, stateMessage, created_at }) => (
						<LineItem
							key={_id}
							to={`/order/${_id}`}
							label={new Date(created_at).toLocaleDateString()}
							value={stateMessage}
						/>
					))}
				</div>
			</div>

			<Link className={'new-order'} to={`/`}>
				<Button className={'form-button'} type='submit'>
					New order
				</Button>
			</Link>

			<SupportLink />
		</FormCard>
	);
}

export default OrdersPage;
