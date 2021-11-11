import { Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './index.scss';

const copyImage = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyNSAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjQyMTEgMEgyLjYzMTU4QzEuMTg0MjEgMCAwIDEuMTU5MDkgMCAyLjU3NTc2VjIwLjYwNjFIMi42MzE1OFYyLjU3NTc2SDE4LjQyMTFWMFpNMjIuMzY4NCA1LjE1MTUySDcuODk0NzRDNi40NDczNyA1LjE1MTUyIDUuMjYzMTYgNi4zMTA2MSA1LjI2MzE2IDcuNzI3MjdWMjUuNzU3NkM1LjI2MzE2IDI3LjE3NDIgNi40NDczNyAyOC4zMzMzIDcuODk0NzQgMjguMzMzM0gyMi4zNjg0QzIzLjgxNTggMjguMzMzMyAyNSAyNy4xNzQyIDI1IDI1Ljc1NzZWNy43MjcyN0MyNSA2LjMxMDYxIDIzLjgxNTggNS4xNTE1MiAyMi4zNjg0IDUuMTUxNTJaTTIyLjM2ODQgMjUuNzU3Nkg3Ljg5NDc0VjcuNzI3MjdIMjIuMzY4NFYyNS43NTc2WiIgZmlsbD0iIzcyNzM3NiIvPgo8L3N2Zz4KCg==`;

export default ({ children }: { children: string }): JSX.Element => {
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (isCopied) {
			setTimeout(() => {
				setIsCopied(false);
			}, 1000);
		}
	}, [isCopied]);

	// TOOD fade effect here
	return (
		<CopyToClipboard text={children} onCopy={() => setIsCopied(true)}>
			<div className={'copy-container'}>
				<div className={'copy-text-container'}>
					<p className={'copy-text'}>{isCopied ? 'Copied!' : children}</p>
				</div>
				<img src={copyImage} className={'copy-icon'} alt={'Copy'} />
			</div>
		</CopyToClipboard>
	);
};
