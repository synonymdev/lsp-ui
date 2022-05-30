import React from 'react';
import './index.scss';

export default ({ children }: { children: string }): JSX.Element => {
	return (
		<div className={'page-heading'}>
			<span>{children}</span>
		</div>
	);
};
