import React, { ReactElement } from 'react';
import './index.scss';

export default ({ children }: { children: string; }): JSX.Element => {
	return <div className={'page-heading'}><h1>{children}</h1></div>;
};
