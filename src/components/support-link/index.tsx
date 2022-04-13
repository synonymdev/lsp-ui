import React from 'react';
import ActionButton, { TActionButtonSize } from '../action-button';
import './index.scss';
import { supportHref } from '../../settings';

// TODO pull current order ID from store
export default ({
	children,
	orderId,
	size
}: {
	children?: string;
	orderId?: string;
	size?: TActionButtonSize;
}): JSX.Element => {
	return (
		<ActionButton href={supportHref(orderId)} size={size}>
			{children ?? 'Contact Support'}
		</ActionButton>
	);
};
