import React from 'react';
import ActionButton from '../action-button';
import './index.scss';

const email = 'suport@synonym.to';

// TODO pull current order ID from store
export default ({ children, orderId }: { children?: string; orderId?: string }): JSX.Element => {
	const subject = `BlockTank support${orderId ? ` (Order ID ${orderId})` : ''}`;

	return (
		<ActionButton href={encodeURI(`mailto:${email}?subject=${subject}`)}>
			{children ?? 'Contact Support'}
		</ActionButton>
	);
};
