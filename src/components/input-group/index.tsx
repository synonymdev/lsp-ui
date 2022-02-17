import { FormControl, InputGroup, Form } from 'react-bootstrap';
import React, { ChangeEventHandler } from 'react';

import './index.scss';
import { ReactComponent as TooltipIcon } from './tooltip.svg';
import { ReactComponent as SatsIcon } from './sats.svg';
import { ReactComponent as WeeksIcon } from './weeks.svg';
import useDisplayValues from '../../hooks/displayValues';

const AppendInput = ({ children }: { children: string | undefined }): JSX.Element => {
	if (!children) {
		return <></>;
	}

	let icon = <></>;
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
			{icon}&nbsp;{children}
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
	placeholder
}: {
	value: string;
	onChange: ChangeEventHandler;
	label: string;
	id: string;
	type: 'number' | 'text';
	append?: string;
	showFiatFromSatsValue?: boolean;
	error?: string;
	onFocus?: ChangeEventHandler;
	onBlur?: ChangeEventHandler;
	placeholder?: string;
}): JSX.Element => {
	const fiat = useDisplayValues(Number(value));

	return (
		<div className='custom-input-group-container'>
			<div className={'custom-input-label-container'}>
				<span className={'custom-input-label'}>{label}</span>
				{showFiatFromSatsValue ? (
					<span className={'custom-input-fiat-conversion'}>
						${fiat.fiatWhole}
						<span className={'decimal'}>
							{fiat.fiatDecimal}
							{fiat.fiatDecimalValue}
						</span>
					</span>
				) : null}
			</div>

			<div className={'custom-input-container'}>
				<input
					className={'custom-input'}
					id={id}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onFocus={onFocus}
					onBlur={onBlur}
				/>

				<span className={'custom-input-append-container'}>
					<AppendInput>{append}</AppendInput>
					<span className={'custom-input-tooltip-icon'}>
						<TooltipIcon />
					</span>
				</span>
			</div>

			{error ? (
				<div className={'custom-input-error'}>
					<span>{error}</span>
				</div>
			) : null}

			{/* <Form.Label htmlFor={id}>{label}</Form.Label> */}
			{/* <InputGroup className='custom-input-group'> */}
			{/*	{append ? <InputGroup.Text className='custom-form-append'>{append}</InputGroup.Text> : null} */}
			{/*	<FormControl */}
			{/*		className='custom-form-control' */}
			{/*		id={id} */}
			{/*		type={type} */}
			{/*		value={value} */}
			{/*		onChange={onChange} */}
			{/*		isInvalid={!!error} */}
			{/*		onFocus={onFocus} */}
			{/*		onBlur={onBlur} */}
			{/*		placeholder={placeholder} */}
			{/*	/> */}
			{/*	<Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback> */}
			{/* </InputGroup> */}
			{/* {showFiatFromSatsValue ? ( */}
			{/*	<div className={'bottom-label'}> */}
			{/*		<span> */}
			{/*			{fiat.fiatSymbol} {fiat.fiatFormatted} */}
			{/*		</span> */}
			{/*	</div> */}
			{/* ) : null} */}
		</div>
	);
};
