import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { IGetOrderResponse } from '@synonymdev/blocktank-client';
import {
	refreshOrder,
	RequestState,
	selectCurrentOrderId,
	selectOrders,
	selectOrdersState
} from '../store/public-store';

export default function useOrder(): {
	order: IGetOrderResponse | undefined;
	orderState: RequestState;
	} {
	const [order, setOrder] = useState<IGetOrderResponse | undefined>(undefined);
	const orderId = useAppSelector(selectCurrentOrderId);
	const orders = useAppSelector(selectOrders);
	const orderState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	useEffect((): void => {
		const newOrder = orders.find((o) => o._id === orderId);
		if (newOrder) {
			setOrder(newOrder);
		}
	}, [orders, orderId]);

	useEffect(() => {
		dispatch(refreshOrder(orderId)).catch((e) => alert(e));
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (order?.state === 500) {
				// Once channel is open stop refreshing, no more state updates required
				return;
			}

			dispatch(refreshOrder(orderId)).catch((e) => alert(e));
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return { order, orderState };
}
