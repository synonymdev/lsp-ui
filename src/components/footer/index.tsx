import React from 'react';
import { ReactComponent as Logo } from '../../icons/footer.svg';

import './index.scss';
import PageIndicator, { TPageIndicator } from '../page-indicator';
import Divider from '../divider';

export default ({ pageIndicator }: { pageIndicator?: TPageIndicator }): JSX.Element => {
	return (
		<>
			{pageIndicator ? <PageIndicator values={pageIndicator} /> : null}
			<Divider />

			<div className={'footer-container'}>
				<Logo />
			</div>
		</>
	);
};
