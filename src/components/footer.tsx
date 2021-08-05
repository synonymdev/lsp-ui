import { Button, Col, Container, Image, Jumbotron, Row } from 'react-bootstrap';
import React from 'react';
import { Link } from 'react-router-dom';

export default (): JSX.Element => {
	return (
		<Jumbotron style={{ marginBottom: 0, marginTop: 300 }}>
			<Container>
				<Row>
					<Col lg={8} md={6} sm={12}>
						<p>
							<Link to={'/'}>Home</Link>
						</p>
						<p>
							<Link to={'/orders'}>Orders</Link>
						</p>
					</Col>
				</Row>
			</Container>
		</Jumbotron>
	);
};
