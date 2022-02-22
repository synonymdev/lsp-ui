import { Card } from 'react-bootstrap';
import React from 'react';
import Header from '../header';
import Footer from '../footer';
import './index.scss';
import { TPageIndicator } from '../page-indicator';

export default ({
	children,
	title,
	backlink,
	pageIndicator
}: {
	children: JSX.Element | JSX.Element[];
	title?: string;
	backlink?: string;
	pageIndicator?: TPageIndicator;
}): JSX.Element => {
	return (
		<Card className={'form-card'}>
			 <div className={'glowy1'} />
			 <div className={'glowy2'} />
			 <div className={'glowy3'} />

			<div className={'form-card-container'}>
				{title ? <Header to={backlink}>{title}</Header> : null}
				<div className={'form-card-content'}>{children}</div>
				<Footer pageIndicator={pageIndicator} />
			</div>
		</Card>
	);
};
