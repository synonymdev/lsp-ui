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
		.replaceAll('#000000', '#FFF')
		.replaceAll('Arial', font)
		.replaceAll('Times New Roman', font);
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
			<Row>
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
