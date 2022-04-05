import React from 'react';
import './index.scss';
import PageIndicator, { TPageIndicator } from '../page-indicator';
import Divider from '../divider';

export default ({ pageIndicator }: { pageIndicator?: TPageIndicator }): JSX.Element => {
	return (
		<>
			{pageIndicator ? <PageIndicator values={pageIndicator} /> : null}
			<Divider />

			<div className={'footer-container'}>
				<img className={'footer-logo'} src={'/images/logo.svg'} alt={'Blocktank'} />
				<span className={'footer-text'}>by Synonym</span>
			</div>
		</>
	);
};
