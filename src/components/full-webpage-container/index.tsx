import React, { ReactElement } from 'react';
import './index.scss';

export default ({ children }): ReactElement => (
	<div className={'webpage-container'}>{children}</div>
);
