import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import { ILnurl } from '@synonymdev/blocktank-client';

function LnurlCard({ lnurl }: { lnurl: ILnurl }): JSX.Element {
	const { uri, k1, tag, callback } = lnurl;

	// TODO get lnurl for QR

	return (
		<Card>
			<Card.Body>
				<Row>
					<Col lg={6}>
						<Card.Title>LNURL</Card.Title>
						<Card.Text>Callback: {callback}</Card.Text>
						<Card.Text>URI: {uri}</Card.Text>
						<Card.Text>K1: {k1}</Card.Text>
						<Card.Text>Tag: {tag}</Card.Text>
					</Col>
					<Col lg={6} style={{ textAlign: 'center' }}>
						<p>
							<QRCode value={uri} />
						</p>
						<a target={'_blank'} href={uri}>
							Open in wallet
						</a>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
}

export default LnurlCard;
