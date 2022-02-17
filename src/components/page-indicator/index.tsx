import React, { ReactElement } from 'react';
import './index.scss';

export default ({ total, active }: { total: number; active: number }): JSX.Element => {
	const dots: ReactElement[] = [];
	for (let index = 0; index < total; index++) {
		dots.push(<div className={`page-indicator ${index === active ? 'active' : ''}`} />);
	}

	return <div className={'page-indicator-container'}>{dots}</div>;
};
