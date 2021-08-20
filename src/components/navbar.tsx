import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default (): JSX.Element => {
	return (
		<Navbar
			bg='primary'
			className='bg-primary custom-navbar'
			expand='lg'
			style={{ marginBottom: 20 }}
		>
			<Container>
				<Link to='/' className='navbar-brand'>
					ChainReactor
				</Link>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='me-auto'>
						<Link to='/' className='nav-link'>
							Home
						</Link>
						<Link to='/orders' className='nav-link'>
							Orders
						</Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};
