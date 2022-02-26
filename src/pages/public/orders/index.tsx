import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
	navigate,
	refreshOrder,
	selectOrders,
	selectOrdersState,
	TPublicPage
} from '../../../store/public-store';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import Divider from '../../../components/divider';
import Button from '../../../components/action-button';
import { ReactComponent as TransferActive } from '../../../icons/transfer-active.svg';
import { ReactComponent as Lightning } from '../../../icons/lightning.svg';
import { ReactComponent as LightningGreen } from '../../../icons/lightning-green.svg';
import { ReactComponent as LightningRed } from '../../../icons/lightning-red.svg';

import './index.scss';

function OrdersPage(): JSX.Element {
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		orders.forEach((o) => {
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
		<FormCard title={'Orders'} backPage={'configure'}>
			<div className={'orders-container'}>
				{orders.map(({ _id, state, stateMessage, created_at }) => {
					const date = new Date(created_at);
					let buttonText = 'Order details';
					let Icon = Lightning;
					let page: TPublicPage = 'order';

					switch (state) {
						case 0: {
							// Awaiting payment
							buttonText = 'Pay now';
							Icon = TransferActive;
							page = 'payment';
							break;
						}
						case 100: {
							// Paid
							buttonText = 'Claim channel';
							page = 'claim';
							break;
						}
						case 200: // URI set
							break;
						case 300: // Channel opening
							Icon = LightningGreen;
							break;
						case 400: // Given up
							Icon = LightningRed;
							break;
						case 450: // Channel closed
							Icon = LightningRed;
							break;
						case 500: // Channel open
							Icon = LightningGreen;
							break;
					}

					return (
						<div key={_id} className={'order-list-item'}>
							<p className={'order-list-item-date'}>
								{date.toLocaleString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
							</p>
							<div className={'order-list-content'}>
								<div className={'order-list-details'}>
									<span className={'order-status-heading'}>Order status</span>
									<span className={'order-status-value'}>
										<Icon className={'order-status-icon'} />
										{stateMessage}
									</span>
								</div>

								<Button onClick={() => dispatch(navigate({ page, orderId: _id }))}>
									{buttonText}
								</Button>
							</div>
							<Divider />
						</div>
					);
				})}
			</div>
		</FormCard>
	);
}

export default OrdersPage;
