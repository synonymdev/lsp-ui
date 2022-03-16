import { Button, Modal, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { login, selectAuth, selectAuthState } from '../../store/admin-store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default (): JSX.Element => {
	const authStatus = useAppSelector(selectAuth);
	const authCheckState = useAppSelector(selectAuthState);
	const dispatch = useAppDispatch();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [token, setToken] = useState('');

	const show = authStatus.authenticated === false;

	const onSubmit = async (): Promise<void> => {
		await dispatch(login({ username, password, token }));
	};

	return (
		<Modal show={show} backdrop='static' keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title>Please login</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>2FA token</Form.Label>
						<Form.Control type='text' value={token} onChange={(e) => setToken(e.target.value)} />
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<pre>Login state: {authCheckState}</pre>
				<Button variant='primary' onClick={onSubmit}>
					Login
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
