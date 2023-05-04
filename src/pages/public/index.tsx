import React from 'react';
import { selectCurrentPage, selectShowMenu } from '../../store/public-store';
import ConfigurePage from './configure';
import OrderPage from './order';
import OrdersPage from './orders';
import ConfirmationPage from './confirm';
import PaymentPage from './payment';
import ClaimPage from './claim';
import TermsPage from './terms';
import MenuPage from './menu';
import SettingsPage from './settings';
import ErrorPage from './error';
import FullWebpageContainer from '../../components/full-webpage-container';
import { useAppSelector } from '../../store/hooks';

import './index.scss';

export const Widget = (): JSX.Element => {
	const page = useAppSelector(selectCurrentPage);
	const showMenu = useAppSelector(selectShowMenu);

	if (showMenu) {
		return <MenuPage />;
	}

	switch (page) {
		case 'configure': {
			return <ConfigurePage />;
		}
		case 'confirm': {
			return <ConfirmationPage />;
		}
		case 'payment': {
			return <PaymentPage />;
		}
		case 'claim': {
			return <ClaimPage />;
		}
		case 'order': {
			return <OrderPage />;
		}
		case 'terms': {
			return <TermsPage />;
		}
		case 'settings': {
			return <SettingsPage />;
		}
		case 'geoblocked': {
			return <ErrorPage type={'geoblocked'} />;
		}
		default: {
			return <OrdersPage />;
		}
	}
};

function PublicPages(): JSX.Element {
	const themeParam = new URLSearchParams(window.location.search).get('theme') ?? '';

	// Check url param, check global var and check host name to determine if we only serve widget card
	if (
		new URLSearchParams(window.location.search).get('embed') === 'true' ||
		(window as any).embedwidget === true ||
		window.location.hostname.includes('widget.')
	) {
		return (
			<div className={themeParam}>
				<Widget />
			</div>
		);
	}

	return (
		<FullWebpageContainer>
			<div className={themeParam}>
				<Widget />
			</div>
		</FullWebpageContainer>
	);
}

export default PublicPages;
