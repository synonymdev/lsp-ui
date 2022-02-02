import { FormControl, InputGroup, Form } from 'react-bootstrap';
import React, { ChangeEventHandler } from 'react';

import './index.scss';

export default ({
	value,
	onChange,
	label,
	id,
	type,
	append
}: {
	value: string;
	onChange: ChangeEventHandler;
	label: string;
	id: string;
	type: 'number' | 'text';
	append: string;
}): JSX.Element => {
	return (
		<>
			<Form.Label htmlFor={id}>{label}</Form.Label>
			<InputGroup className='custom-input-group-container'>
				{append ? <InputGroup.Text className='custom-form-append'>{append}</InputGroup.Text> : null}
				<FormControl
					className='custom-form-control'
					id={id}
					type={type}
					value={value}
					onChange={onChange}
				/>
			</InputGroup>
		</>
	);
};
