import React from 'react';
import { ReactComponent as ErrorIcon } from '../../icons/error.svg';
import './index.scss';

export default ({
	onErrorClick,
	children
}: {
	onErrorClick?: any;
	children?: string;
}): JSX.Element => {
	if (!children) {
		return <></>;
	}
	return (
		<div onClick={onErrorClick} className={'custom-error-container error-cursor-mouseover'}>
			<div>
				<span>{children}</span>
			</div>
			<ErrorIcon className={'custom-error-icon'} />
		</div>
	);
};
