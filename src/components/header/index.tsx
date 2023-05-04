import React from 'react';
import { ReactComponent as BackIcon } from '../../icons/back.svg';
import { ReactComponent as BackIconPurple } from '../../icons/back-purple.svg';
import { navigate, selectShowMenu, setShowMenu, TPublicPage } from '../../store/public-store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ReactComponent as MenuIcon } from '../../icons/menu-white.svg';
import { ReactComponent as MenuIconPurple } from '../../icons/menu-purple.svg';
import { ReactComponent as CloseIcon } from '../../icons/close-white.svg';
import { ReactComponent as CloseIconPurple } from '../../icons/close-purple.svg';
import { ReactComponent as LightningIcon } from '../../icons/lightning-active.svg';
import { ReactComponent as LightningIconPurple } from '../../icons/lightning-purple.svg';

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

	const themeParam = new URLSearchParams(window.location.search).get('theme') ?? '';

	return (
		<div className={'header-container'}>
			{backPage ? (
				<div className={'header-button'} onClick={() => dispatch(navigate({ page: backPage }))}>
					{themeParam === 'ln-dark' || themeParam === 'ln-light' ? (
						<BackIconPurple />
					) : (
						<BackIcon />
					)}
				</div>
			) : (
				<div />
			)}
			<h4 className={'header-title'}>
				{showLightningIcon ? (
					themeParam === 'ln-dark' || themeParam === 'ln-light' ? (
						<LightningIconPurple />
					) : (
						<LightningIcon />
					)
				) : null}{' '}
				{children}
			</h4>
			<div className={'header-button'} onClick={() => dispatch(setShowMenu(!showMenu))}>
				{showMenu ? (
					themeParam === 'ln-dark' || themeParam === 'ln-light' ? (
						<CloseIconPurple />
					) : (
						<CloseIcon />
					)
				) : themeParam === 'ln-dark' || themeParam === 'ln-light' ? (
					<MenuIconPurple />
				) : (
					<MenuIcon />
				)}
			</div>
		</div>
	);
};
