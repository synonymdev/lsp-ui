import React from 'react';
import { ReactComponent as Logo } from './footer.svg';

import './index.scss';

export default (): JSX.Element => {
	return (
		<div className={'footer-container'}>
			<Logo />
		</div>
	);
};
