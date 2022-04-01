import React from 'react';

import './index.scss';

export type TIconRingType = 'success' | 'error' | 'neutral' | 'pending';
export type TIcon = 'hourglass-3d' | 'lightning-3d' | 'thumb-down-3d' | 'checkmark' | 'coins-3d'; // Add 3D icon to /public/icons when adding an icon type

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
				<img alt={icon} className={'icon-ring-image'} src={`/icons/${icon}.png`} />
				{showCross ? <div className={'icon-ring-neutral-line'} /> : null}
			</div>
		</div>
	);
};
