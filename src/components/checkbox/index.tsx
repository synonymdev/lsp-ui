import { Form } from 'react-bootstrap';
import React from 'react';

import { ReactComponent as CheckmarkIcon } from '../../icons/checkmark.svg';
import './index.scss';

export default ({
	children,
	isChecked,
	setIsChecked,
	error
}: {
	children: React.ReactElement | React.ReactElement[];
	isChecked: boolean;
	setIsChecked: (checked: boolean) => void;
	error?: string;
}): JSX.Element => {
	const handleOnChange = (): void => {
		setIsChecked(!isChecked);
	};

	return (
		<div>
			<div className={'custom-checkbox-container'}>
				<div className={`custom-checkbox ${isChecked ? 'checked' : ''}`} onClick={handleOnChange}>
					{isChecked ? <CheckmarkIcon /> : null}
				</div>

				<span className={'custom-label'}>{children}</span>
			</div>

			{error ? <span>{error}</span> : null}
		</div>
	);
};
