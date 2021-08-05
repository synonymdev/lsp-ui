import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function OrderPage(): JSX.Element {
	const { orderId } = useParams();

	return (
		<Container>
			<h1>Order: {orderId}</h1>
		</Container>
	);
}

export default OrderPage;
