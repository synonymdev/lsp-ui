import { Card } from 'react-bootstrap';
import React from 'react';
import './index.scss';

export default ({ label, value }): JSX.Element => {
	return (
		<div className={'line-item'}>
			<span className={'label'}>{label}</span>
			<span className={'value'}>{value}</span>
		</div>
	);
};
