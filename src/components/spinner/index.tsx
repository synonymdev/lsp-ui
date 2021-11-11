import React from 'react';
import './index.scss';

export default ({ style }: { style?: object }): JSX.Element => {
	return (
		<div className={'spinner-container'}>
			<div className='spinner' style={style}>Loading...</div>
		</div>
	);
};
