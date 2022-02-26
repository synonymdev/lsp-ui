import React from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { navigate, TPublicPage } from '../../../store/public-store';
import FormCard from '../../../components/form-card';
import Divider from '../../../components/divider';
import { ReactComponent as RightIcon } from '../../../icons/right-arrow-white.svg';

import './index.scss';

const MenuItem = ({ page, title }: { page: TPublicPage; title: string }): JSX.Element => {
	const dispatch = useAppDispatch();

	return (
		<div onClick={() => dispatch(navigate({ page, showMenu: false }))}>
			<div className={'menu-item-line'}>
				<span className={'menu-item-title'}>{title}</span>
				<RightIcon />
			</div>
			<Divider />
		</div>
	);
};

function MenuPage(): JSX.Element {
	const options: Array<{ title: string; page: TPublicPage }> = [
		{ title: 'New channel', page: 'configure' },
		{ title: 'My orders', page: 'orders' },
		{ title: 'Support', page: 'configure' } // TODO
	];

	return (
		<FormCard title={'Menu'}>
			<div className={'menu-container'}>
				<div className={'menu-list'}>
					{options.map(({ title, page }) => (
						<MenuItem key={page} page={page} title={title} />
					))}
				</div>
				<div className={'menu-terms-link-container'}>
					<a href={'/terms-and-conditions'} target={'_blank'}>
						Terms of service
					</a>
				</div>
			</div>
		</FormCard>
	);
}

export default MenuPage;
