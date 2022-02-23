import React, { ReactElement } from 'react';
import './index.scss';

export type TPageIndicator = {
	total: number;
	active: number;
};

export default ({ values }: { values: TPageIndicator }): JSX.Element => {
	const { total, active } = values;
	const dots: ReactElement[] = [];
	for (let index = 0; index < total; index++) {
		dots.push(<div className={`page-indicator ${index === active ? 'active' : ''}`} />);
	}

	return <div className={'page-indicator-container'}>{dots}</div>;
};
