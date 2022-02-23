import { Button, Overlay } from 'react-bootstrap';
import React, { useRef, useState } from 'react';

import './index.scss';
import { ReactComponent as TooltipIcon } from '../../icons/tooltip.svg';

export type TooltipProps = {
	title: string;
	body: string;
};

// TODO Detect device. Hover for desktop, click for mobile
export default ({ tip }: { tip?: TooltipProps }): JSX.Element => {
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
