import React, { useEffect, useState } from 'react';
import Spinner from '../../../components/spinner';
import './index.scss';
import { Col, Container, Row } from 'react-bootstrap';

const fetchContent = async(): Promise<string> => {
	const res = await fetch('/terms-and-conditions.html');
	return await (await res.blob()).text();
};

const format = (rawHtml: string): string => {
	const font = 'Neue Haas Grotesk Display Pro';
	return rawHtml
		.replaceAll('#000000', '#FFF') // Black fonts need to be white on our BG
		.replaceAll('Arial', font)
		.replaceAll('Times New Roman', font)
		.replaceAll('c13', '') // Removes white highlighted text
		.replaceAll('c5', ''); // Removes white highlighted text
};

function TermsPage(): JSX.Element {
	const [content, setContent] = useState('');
	useEffect(() => {
		fetchContent()
			.then((c) => setContent(format(c)))
			.catch((e) => alert('Failed to load terms and conditions'));
	}, []);

	return (
		<Container>
			<Row className='justify-content-md-center'>
				{content ? (
					<Col lg={10} md={11} sm={11}>
						<div className={'terms-container'} dangerouslySetInnerHTML={{ __html: content }}></div>
					</Col>
				) : (
					<div className={'terms-spinner-container'}>
						<Spinner centered />
					</div>
				)}
			</Row>
		</Container>
	);
}

export default TermsPage;
