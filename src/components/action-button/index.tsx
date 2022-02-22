import React, {
	FunctionComponent,
	ReactComponentElement,
	ReactElement,
	useEffect,
	useState
} from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReactComponent as CopyIcon } from '../../icons/copy.svg';

import './index.scss';

export default ({
	children,
	copyText,
	onClick,
	Icon,
	disabled
}: {
	children: string;
	copyText?: string;
	onClick?: () => void;
	Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
	disabled?: boolean;
}): JSX.Element => {
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (isCopied) {
			setTimeout(() => {
				setIsCopied(false);
			}, 1000);
		}
	}, [isCopied]);

	let ButtonIcon = Icon;
	if (!ButtonIcon && copyText) {
		ButtonIcon = CopyIcon;
	}

	const button = (
		<div className={'action-button-container'} onClick={!disabled ? onClick : undefined}>
			{ButtonIcon ? <ButtonIcon className={'action-button-icon'} /> : null}
			<span className={'action-button-text'}>{isCopied ? 'Copied!' : children}</span>
		</div>
	);

	if (!copyText) {
		return button;
	}

	return (
		<CopyToClipboard text={copyText} onCopy={() => setIsCopied(true)}>
			{button}
		</CopyToClipboard>
	);
};
