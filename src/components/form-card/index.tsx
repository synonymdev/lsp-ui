import { Card } from 'react-bootstrap';
import React from 'react';
import './index.scss';

export default ({ children }): JSX.Element => {
	return (
		<Card className={'form-card'}>
			<div className={'ellipse89'} />
			<div className={'ellipse90'} />
			<div className={'ellipse91'} />
			{children}
		</Card>
	);
};
