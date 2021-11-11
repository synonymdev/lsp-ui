import React from 'react';
import Spinner from '../spinner';
import './index.scss';

export default ({
	label,
	value,
	spinner
}: {
	label: string;
	value: string;
	spinner?: boolean;
}): JSX.Element => {
	return (
		<div className={'line-item'}>
			<span className={'label'}>{label}</span>
			<span className={'value'}>{value}</span>
			{spinner ? <Spinner /> : null}
		</div>
	);
};
