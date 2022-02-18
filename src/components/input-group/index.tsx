import { Button, Overlay, OverlayTrigger } from 'react-bootstrap';
import React, { ChangeEventHandler, useRef, useState } from 'react';

import './index.scss';
import { ReactComponent as TooltipIcon } from '../../icons/tooltip.svg';
import { ReactComponent as SatsIcon } from '../../icons/sats.svg';
import { ReactComponent as WeeksIcon } from '../../icons/weeks.svg';
import Error from '../inline-error';
import useDisplayValues from '../../hooks/displayValues';

export type TTooltip = {
	title: string;
	body: string;
};

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

// TODO move tooltip to new component
// TODO Detect device. Hover for desktop, click for mobile
const Tooltip = ({ tip }: { tip?: TTooltip }): JSX.Element => {
	const [show, setShow] = useState(false);
	const target = useRef(null);

	if (!tip) {
		return <></>;
	}

	return (
		<>
			<span
				className={'custom-input-tooltip-icon'}
				onMouseEnter={() => setShow(true)}
				onMouseLeave={() => setTimeout(() => setShow(false), 250)}
			>
				<TooltipIcon ref={target} onClick={() => setShow(!show)} />
			</span>
			<Overlay target={target.current} show={show} placement='left'>
				{({ placement, arrowProps, show: _show, popper, ...props }) => (
					<div
						{...props}
						className={'custom-input-tooltip-container'}
						style={{
							...props.style,
							backgroundColor: 'rgba(16, 16, 16, 0.92)',
							borderRadius: 10
						}}
					>
						<h4>{tip.title}</h4>
						<p>{tip.body}</p>
					</div>
				)}
			</Overlay>
		</>
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
	tooltip?: TTooltip;
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
					<Tooltip tip={tooltip}></Tooltip>
				</span>
			</div>

			<Error>{error}</Error>
		</div>
	);
};
