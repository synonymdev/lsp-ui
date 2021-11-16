import React from 'react';
import QRCode from 'react-qr-code';
import './index.scss';

export default ({ size, value }: { size: number; value: string }): JSX.Element => {
	return (
		<div className={'qr-row'}>
			<div className={'qr-container'} style={{ width: size, height: size }}>
				<QRCode value={value} size={size - 10} />
			</div>
		</div>
	);
};
