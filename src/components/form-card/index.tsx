import { Card } from 'react-bootstrap';
import React from 'react';
import Footer from '../footer';
import './index.scss';

export default ({ children }): JSX.Element => {
	return (
		<Card className={'form-card'}>
			<div className={'glowy1'} />
			<div className={'glowy2'} />
			<div className={'glowy3'} />
			{children}

			<Footer />
		</Card>
	);
};
