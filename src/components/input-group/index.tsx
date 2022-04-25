import React, { ChangeEventHandler, ReactElement, useState } from 'react';
import NumberFormat from 'react-number-format';
import { ReactComponent as SatsIcon } from '../../icons/lightning-active.svg';
import { ReactComponent as WeeksIcon } from '../../icons/weeks.svg';
import Error from '../inline-error';
import useDisplayValues from '../../hooks/displayValues';
import Tooltip, { TooltipProps } from '../tooltip';

import './index.scss';

const AppendInput = ({ children }: { children: string | undefined }): JSX.Element => {
	if (!children) {
		return <></>;
	}

	let icon: ReactElement | undefined;
	switch (children.toLocaleLowerCase()) {
		case 'sats': {
			icon = <SatsIcon />;
			break;
		}
		case 'weeks': {
			icon = <WeeksIcon />;
			break;
		}
	}

	return (
		<span className={'custom-input-append'}>
			{icon ? <span className={'custom-input-append-icon'}>{icon}</span> : null}
			{children}
		</span>
	);
};

export default ({
	value,
	onChange,
	label,
	id,
	type,
	append,
	showFiatFromSatsValue,
	error,
	onFocus,
	onBlur,
	placeholder,
	tooltip
}: {
	value: string;
	onChange: (string) => void;
	label: string;
	id: string;
	type: 'number' | 'text';
	append?: string;
	showFiatFromSatsValue?: boolean;
	error?: string;
	onFocus?: ChangeEventHandler;
	onBlur?: ChangeEventHandler;
	placeholder?: string;
	tooltip?: TooltipProps;
}): JSX.Element => {
	const fiat = useDisplayValues(Number(value));
	const [displayedPlaceholder, setDisplayedPlaceholder] = useState(placeholder);

	const customOnFocus: ChangeEventHandler = (e) => {
		onFocus?.(e);
		setDisplayedPlaceholder('');
	};

	const customOnBlur: ChangeEventHandler = (e) => {
		onBlur?.(e);
		setDisplayedPlaceholder(placeholder);
	};

	return (
		<div className='custom-input-group-container'>
			<div className={'custom-input-label-container'}>
				<span className={'custom-input-label'}>{label}</span>
				{showFiatFromSatsValue ? (
					<span className={'custom-input-fiat-conversion'}>
						{fiat.fiatSymbol}
						{fiat.fiatWhole}
						<span className={'decimal'}>
							{fiat.fiatDecimal}
							{fiat.fiatDecimalValue}
						</span>
					</span>
				) : null}
			</div>

			<div className={'custom-input-container'}>
				{type === 'number' ? (
					<NumberFormat
						className={'custom-input'}
						thousandSeparator={' '}
						id={id}
						placeholder={displayedPlaceholder}
						value={value}
						onValueChange={(values, sourceInfo) => onChange(values.value)}
						onFocus={customOnFocus}
						onBlur={customOnBlur}
					/>
				) : (
					<input
						className={'custom-input'}
						id={id}
						type={type}
						placeholder={displayedPlaceholder}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						onFocus={customOnFocus}
						onBlur={customOnBlur}
					/>
				)}

				<span className={'custom-input-append-container'}>
					<AppendInput>{append}</AppendInput>
					<Tooltip tip={tooltip}></Tooltip>
				</span>
			</div>

			<Error>{error}</Error>
		</div>
	);
};
