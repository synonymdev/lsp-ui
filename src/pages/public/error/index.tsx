import React from 'react';
import FormCard from '../../../components/form-card';
import Heading from '../../../components/heading';
import IconRing, { TIcon } from '../../../components/icon-ring';
import SupportLink from '../../../components/support-link';

import './index.scss';
import { TPublicPage } from '../../../store/public-store';

function ErrorPage(props: {
	type: 'geoblocked' | 'generic' | 'orderNotFound' | 'unavailable';
}): JSX.Element {
	let headerMessage = 'An error occurred. Please try again later.';
	let backPage: TPublicPage | undefined;
	let icon: TIcon = 'wrench-3d';

	switch (props.type) {
		case 'geoblocked':
			headerMessage = 'Sorry, Blocktank is not (yet) available in your area. ';
			icon = 'globe-3d';
			break;
		case 'orderNotFound':
			headerMessage = 'This order could not be found.';
			backPage = 'configure';
			break;
		case 'unavailable':
			headerMessage = 'Blocktank is currently offline. Please try again later.';
			icon = 'wrench-3d';
			break;
		case 'generic':
			backPage = 'configure';
			break;
	}

	return (
		<FormCard backPage={backPage} title={'Lightning Channel'}>
			<Heading>Sorry!</Heading>
			<div className={'error-page-container'}>
				<p className={'error-page-message'}>{headerMessage}</p>
				<div className={'error-page-content'}>
					<IconRing icon={icon} type={'error'} />
					<div className={'support-button-container'}>
						<SupportLink />
					</div>
				</div>
			</div>
		</FormCard>
	);
}

export default ErrorPage;
