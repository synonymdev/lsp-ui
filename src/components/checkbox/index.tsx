import { Form } from 'react-bootstrap';
import React from 'react';

import './index.scss';

export default ({
	children,
	isChecked,
	setIsChecked
}: {
	children: React.ReactElement | React.ReactElement[];
	isChecked: boolean;
	setIsChecked: (checked: boolean) => void;
}): JSX.Element => {
	const handleOnChange = (): void => {
		setIsChecked(!isChecked);
	};

	return (
		<Form.Check type={'checkbox'}>
			<Form.Check.Input checked={isChecked} onChange={handleOnChange} type={'checkbox'} />
			<Form.Check.Label>{children}</Form.Check.Label>
		</Form.Check>
	);
};
