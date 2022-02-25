import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner';
import './index.scss';

export default ({
	label,
	value,
	spinner,
	to,
	onClick
}: {
	label: string;
	value: string;
	spinner?: boolean;
	to?: string;
	onClick?: () => void;
}): JSX.Element => {
	const content = (
		<>
			<span className={'label'}>{label}</span>
			<span className={'value'}>{value}</span>
			{spinner ? <Spinner /> : null}
		</>
	);

	if (to) {
		return (
			<Link to={to} className={'line-item'}>
				{content}
			</Link>
		);
	}

	return (
		<div className={'line-item'} onClick={onClick}>
			{content}
		</div>
	);
};
