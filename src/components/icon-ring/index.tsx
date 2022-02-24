import React from 'react';

import './index.scss';

export type TIconRingType = 'success' | 'error' | 'neutral' | 'pending';
export type TIcon = 'hourglass' | 'lightning' | 'thumb-down'; // Add 3D icon to /public/icons when adding an icon type

export default ({
	icon,
	type,
	showCross
}: {
	icon: TIcon;
	type: TIconRingType;
	showCross?: boolean;
}): JSX.Element => {
	return (
		<div className={'icon-ring-container'}>
			<div className={`icon-ring-${type}`}>
				<img alt={icon} className={'icon-ring-image'} src={`/icons/${icon}-3d.png`} />
				{showCross ? <div className={'icon-ring-neutral-line'} /> : null}
			</div>
		</div>
	);
};
