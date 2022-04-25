import React from 'react';
import { ReactComponent as SatsIcon } from '../../icons/lightning-active.svg';
import useDisplayValues from '../../hooks/displayValues';

import './index.scss';

export default ({
	label,
	value,
	showFiat,
	showBitcoin,
	size = 'md',
	Icon
}: {
	label: string;
	value: number | string;
	showFiat?: boolean;
	showBitcoin?: boolean;
	size?: 'md' | 'lg';
	Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
}): JSX.Element => {
	const displayValues = useDisplayValues(Number(value));

	// Display as is with no formatting if it's a string
	const formattedValue = typeof value === 'string' ? value : displayValues.bitcoinFormatted;

	const PrependIcon = Icon ?? SatsIcon;

	return (
		<div className={'value-group-container'}>
			<div className={'value-group-row1'}>
				<span className={'value-group-label'}>{label}</span>
				{showFiat ? (
					<span className={'value-group-convert'}>
						{' '}
						{displayValues.fiatSymbol}
						{displayValues.fiatWhole}
						<span className={'decimal'}>
							{displayValues.fiatDecimal}
							{displayValues.fiatDecimalValue}
						</span>
						{showBitcoin ? (
							<span className={'bitcoin-value'}>
								&nbsp;{displayValues.altBitcoinSymbol}
								{displayValues.altBitcoinFormatted.substr(0, 6)}
								<span className={'decimal'}>
									{displayValues.altBitcoinFormatted.substr(
										6,
										displayValues.altBitcoinFormatted.length - 6
									)}
								</span>
							</span>
						) : null}
					</span>
				) : null}
			</div>

			<div className={'value-group-row2'}>
				<PrependIcon className={`value-group-icon-${size}`} />
				<span className={`value-group-sats ${size}`}>{formattedValue}</span>
			</div>
		</div>
	);
};
