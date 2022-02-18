import React from 'react';

import './index.scss';

export default ({ local, remote }: { local: number; remote: number }): JSX.Element => {
	const flexTotal = Math.max(local, remote) * 2;
	const bufferRemoteFlex = local > remote ? flexTotal - local - remote : 0;
	const bufferLocalFlex = remote > local ? flexTotal - remote - local : 0;

	return (
		<div className={'channel-balance-bar-container'}>
			<div className={'channel-balance-remote-buffer'} style={{ flex: bufferRemoteFlex }}></div>
			<div className={'channel-balance-remote'} style={{ flex: remote }}></div>
			<div className={'channel-balance-local'} style={{ flex: local }}></div>
			<div className={'channel-balance-local-buffer'} style={{ flex: bufferLocalFlex }}></div>
		</div>
	);
};
