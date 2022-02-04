import { Form } from 'react-bootstrap';
import React from 'react';

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
		<Form.Check type={'checkbox'} className={'custom-checkbox'}>
			<Form.Check.Input checked={isChecked} onChange={handleOnChange} type={'checkbox'} isInvalid={!!error} />
			<Form.Check.Label>{children}</Form.Check.Label>
			<Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
		</Form.Check>
	);
};
