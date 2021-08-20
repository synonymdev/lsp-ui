import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import { IGetOrderResponse } from '../utils/client/types';

function Payment({ order }: { order: IGetOrderResponse }): JSX.Element {
	const { btc_address, purchase_invoice, total_amount, _id } = order;

	const btc = total_amount / 100000000;

	const uri = `bitcoin:${btc_address}?lightning=${purchase_invoice}?amount=${btc}&label=${_id}`;

	return (
		<Card>
			<Card.Body>
				<Row style={{ textAlign: 'center' }}>
					<Col lg={6}>
						<p>
							<QRCode value={uri} />
						</p>
						<a target={'_blank'} href={uri}>
							Open in wallet
						</a>
					</Col>
					<Col lg={6}>
						<p>{btc_address}</p>
						<p>{purchase_invoice}</p>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
}

export default Payment;
