import React from 'react';
import { ReactComponent as SatsIcon } from '../../icons/lightning-active.svg';
import './index.scss';
import useDisplayValues from '../../hooks/displayValues';

export default ({
	label,
	sats,
	showFiat,
	showBitcoin,
	size = 'md'
}: {
	label: string;
	sats: number;
	showFiat: boolean;
	showBitcoin?: boolean;
	size?: 'md' | 'lg';
}): JSX.Element => {
	const displayValues = useDisplayValues(Number(sats));

	return (
		<div className={'value-group-container'}>
			<div className={'value-group-row1'}>
				<span className={'value-group-label'}>{label}</span>
				{showFiat ? (
					<span className={'value-group-convert'}>
						{' '}
						${displayValues.fiatWhole}
						<span className={'decimal'}>
							{displayValues.fiatDecimal}
							{displayValues.fiatDecimalValue}
						</span>
						{showBitcoin ? (
							<span className={'bitcoin-value'}>
								&nbsp;{displayValues.altBitcoinSymbol}
								<span className={'decimal'}>{displayValues.altBitcoinFormatted}</span>
							</span>
						) : null}
					</span>
				) : null}
			</div>

			<div className={'value-group-row2'}>
				<SatsIcon className={`value-group-icon-${size}`} />
				<span className={`value-group-sats ${size}`}>{displayValues.bitcoinFormatted}</span>
			</div>
		</div>
	);
};
