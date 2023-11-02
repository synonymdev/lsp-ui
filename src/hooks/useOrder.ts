import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
	refreshOrder,
	RequestState,
	selectCurrentOrderId,
	selectOrders,
	selectOrdersState
} from '../store/public-store';
import { UseOrder, UseOrderResponse } from '../utils/helpers';

export default function useOrder(): UseOrder {
	const [order, setOrder] = useState<UseOrderResponse | undefined>(undefined);
	const orderId = useAppSelector(selectCurrentOrderId);
	const orders = useAppSelector(selectOrders);
	const orderState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	useEffect((): void => {
		const newOrder = orders.find((o) => o.id === orderId);
		if (newOrder) {
			setOrder(newOrder);
		}
	}, [orders, orderId]);

	useEffect(() => {
		dispatch(refreshOrder(orderId)).catch((e) => alert(e));
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (order?.state === 'open') {
				// Once channel is open stop refreshing, no more state updates required
				return;
			}

			dispatch(refreshOrder(orderId)).catch((e) => alert(e));
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return { order, orderState };
}
