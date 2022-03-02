import React from 'react';
import { selectCurrentPage, selectShowMenu } from '../../store/public-store';
import ConfigurePage from './configure';
import OrderPage from './order';
import OrdersPage from './orders';
import ConfirmationPage from './confirm';
import PaymentPage from './payment';
import ClaimPage from './claim';
import MenuPage from './menu';
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
		default: {
			return <OrdersPage />;
		}
	}
};

function PublicPages(): JSX.Element {
	// Check url param, check global var and check host name to determine if we only serve widget card
	if (
		new URLSearchParams(window.location.search).get('embed') === 'true' ||
		(window as any).embedwidget === true ||
		window.location.hostname.includes('widget.')
	) {
		return <Widget />;
	}

	return (
		<FullWebpageContainer>
			<Widget />
		</FullWebpageContainer>
	);
}

export default PublicPages;
