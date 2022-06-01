import React, { useEffect, useState } from 'react';
import Spinner from '../../../components/spinner';
import FormCard from '../../../components/form-card';
import { Col, Container, Row } from 'react-bootstrap';

import './index.scss';

const fetchContent = async (): Promise<string> => {
	const res = await fetch('/terms-and-conditions-raw.html');
	return await (await res.blob()).text();
};

const format = (rawHtml: string): string => {
	const font = 'Neue Haas Grotesk Display Pro';
	return rawHtml
		.replaceAll('#000000', '#FFF') // Black fonts need to be white on our BG
		.replaceAll('Arial', font)
		.replaceAll('Times New Roman', font)
		.replaceAll('c13', '') // Removes white highlighted text
		.replaceAll('c5', '') // Removes white highlighted text
		.replaceAll('<h3', '<p')
		.replaceAll('h3>', 'p>');
};

function TermsPage({ showFullPage }: { showFullPage?: boolean }): JSX.Element {
	const [content, setContent] = useState('');
	useEffect(() => {
		fetchContent()
			.then((c) => setContent(format(c)))
			.catch((e) => alert('Failed to load terms and conditions'));
	}, []);

	const contents = (
		<>
			{content ? (
				<Col lg={10} md={11} sm={11}>
					<div className={'terms-container'} dangerouslySetInnerHTML={{ __html: content }}></div>
				</Col>
			) : (
				<div className={'terms-spinner-container'}>
					<Spinner centered />
				</div>
			)}
		</>
	);

	if (showFullPage) {
		return (
			<Container>
				<Row className='justify-content-md-center'>{contents}</Row>
			</Container>
		);
	}

	return (
		<FormCard title={'Terms of service'} backPage={'confirm'}>
			{contents}
		</FormCard>
	);
}

export default TermsPage;
