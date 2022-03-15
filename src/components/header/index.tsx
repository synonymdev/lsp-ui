import React from 'react';
import { ReactComponent as BackIcon } from '../../icons/back.svg';
import { navigate, selectShowMenu, setShowMenu, TPublicPage } from '../../store/public-store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ReactComponent as MenuIcon } from '../../icons/menu-white.svg';
import { ReactComponent as CloseIcon } from '../../icons/close-white.svg';
import { ReactComponent as LightningIcon } from '../../icons/lightning-active.svg';

import './index.scss';

export default ({
	backPage,
	children,
	showLightningIcon
}: {
	backPage?: TPublicPage;
	children: string;
	showLightningIcon?: boolean;
}): JSX.Element => {
	const dispatch = useAppDispatch();
	const showMenu = useAppSelector(selectShowMenu);

	return (
		<div className={'header-container'}>
			{backPage ? (
				<div className={'header-button'} onClick={() => dispatch(navigate({ page: backPage }))}>
					<BackIcon />
				</div>
			) : (
				<div />
			)}
			<h4 className={'header-title'}>
				{showLightningIcon ? <LightningIcon /> : null} {children}
			</h4>
			<div className={'header-button'} onClick={() => dispatch(setShowMenu(!showMenu))}>
				{showMenu ? <CloseIcon /> : <MenuIcon />}
			</div>
		</div>
	);
};
