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
		<Form.Check type={'checkbox'} className={'checkbox-container'}>
			<Form.Check.Input
				checked={isChecked}
				onChange={handleOnChange}
				type={'checkbox'}
				className={'checkbox'}
			/>
			<Form.Check.Label className={'label'}>{children}</Form.Check.Label>
		</Form.Check>
	);
};
