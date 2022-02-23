import React from 'react';
import { ReactComponent as ErrorIcon } from '../../icons/error.svg';
import './index.scss';

export default ({ children }: { children?: string }): JSX.Element => {
	if (!children) {
		return <></>;
	}
	return (
		<div className={'custom-error-container'}>
			<div>
				<span>{children}</span>
			</div>
			<ErrorIcon className={'custom-error-icon'} />
		</div>
	);
};
