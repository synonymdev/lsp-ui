import React from 'react';
import './index.scss';

export default ({ style, centered }: { style?: object; centered?: boolean }): JSX.Element => {
	return (
		<div className={`spinner-container ${centered ? 'spinner-container-centered' : ''}`}>
			<div className='spinner' style={style}>
				Loading...
			</div>
		</div>
	);
};
