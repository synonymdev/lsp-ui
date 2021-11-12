import React from 'react';
import './index.scss';

const email = 'suport@synonym.to';

export default ({ children, orderId }: { children?: string; orderId?: string }): JSX.Element => {
	const subject = `BlockTank support${orderId ? ` (Order ID ${orderId})` : ''}`;

	return (
		<span className={'support-link-container'}>
			<a className={'link'} href={encodeURI(`mailto:${email}?subject=${subject}`)}>
				{children ?? 'Contact Support'}
			</a>
		</span>
	);
};
