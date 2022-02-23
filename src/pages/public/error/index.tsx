import React from 'react';
import FormCard from '../../../components/form-card';
import Heading from '../../../components/heading';
import IconRing from '../../../components/icon-ring';
import SupportLink from '../../../components/support-link';

import './index.scss';

function ErrorPage(props: { type: 'geoblocked' | 'generic' }): JSX.Element {
	let headerMessage = 'An error occurred. Please try again later.';
	switch (props.type) {
		case 'geoblocked':
			headerMessage = 'Blocktank services are not available in your area.';
			break;
		case 'generic':
	}

	return (
		<FormCard title={'Lightning Channel'}>
			<Heading>Sorry!</Heading>
			<div className={'error-page-container'}>
				<p className={'error-page-message'}>{headerMessage}</p>
				<div className={'error-page-content'}>
					<IconRing icon={'thumb-down'} type={'error'} />
					<div className={'support-button-container'}>
						<SupportLink />
					</div>
				</div>
			</div>
		</FormCard>
	);
}

export default ErrorPage;
