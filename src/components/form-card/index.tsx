import { Card } from 'react-bootstrap';
import React from 'react';
import Header from '../header';
import Footer from '../footer';
import './index.scss';
import { TPageIndicator } from '../page-indicator';
import { TPublicPage } from '../../store/public-store';

export default ({
	children,
	title,
	backPage,
	pageIndicator,
	showLightningIcon
}: {
	children: JSX.Element | JSX.Element[];
	title?: string;
	backPage?: TPublicPage;
	pageIndicator?: TPageIndicator;
	showLightningIcon?: boolean;
}): JSX.Element => {
	return (
		<Card className={'form-card'}>
			<div className={'glowy1'} />
			<div className={'glowy2'} />
			<div className={'glowy3'} />

			<div className={'form-card-container'}>
				{title ? (
					<Header backPage={backPage} showLightningIcon={showLightningIcon}>
						{title}
					</Header>
				) : null}
				<div className={'form-card-content'}>{children}</div>
				<Footer pageIndicator={pageIndicator} />
			</div>
		</Card>
	);
};
