import React from 'react';
import ActionButton from '../action-button';
import './index.scss';
import { supportHref } from '../../settings';

// TODO pull current order ID from store
export default ({ children, orderId }: { children?: string; orderId?: string }): JSX.Element => {
	return <ActionButton href={supportHref(orderId)}>{children ?? 'Contact Support'}</ActionButton>;
};
