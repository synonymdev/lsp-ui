import React from 'react';
import { Link } from 'react-router-dom';

import './index.scss';
import { useAppSelector } from '../../store/hooks';
import { selectOrders } from '../../store/public-store';

export default (): JSX.Element => {
	const orders = useAppSelector(selectOrders);

	if (orders.length === 0) {
		return <></>;
	}

	return (
		<span className={'orders-link-container'}>
			<Link className={'link'} to={'/orders'}>
				My orders
			</Link>
		</span>
	);
};
