import { Form } from 'react-bootstrap';
import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../icons/back.svg';

import './index.scss';

export default ({ to, children }: { to?: string; children: string }): JSX.Element => {
	return (
		<div className={'backlink-container'}>
			{to ? (
				<div className={'header-backlink'}>
					<Link to={to}>
						<BackIcon />
					</Link>{' '}
				</div>
			) : null}
			<h4>{children}</h4>
		</div>
	);
};
