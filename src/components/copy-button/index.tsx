import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReactComponent as CopyIcon } from '../../icons/copy-icon.svg';

import './index.scss';

export default ({ children, value }: { children: string; value: string }): JSX.Element => {
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (isCopied) {
			setTimeout(() => {
				setIsCopied(false);
			}, 1000);
		}
	}, [isCopied]);

	return (
		<CopyToClipboard text={value} onCopy={() => setIsCopied(true)}>
			<div className={'copy-button-container'}>
				<CopyIcon className={'copy-button-icon'} />
				<span className={'copy-button-text'}>{isCopied ? 'Copied!' : children}</span>
			</div>
		</CopyToClipboard>
	);
};
