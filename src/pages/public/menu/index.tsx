import React from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { navigate, TPublicPage } from '../../../store/public-store';
import FormCard from '../../../components/form-card';
import Divider from '../../../components/divider';
import { ReactComponent as RightIcon } from '../../../icons/right-arrow-white.svg';

import './index.scss';
import { supportHref } from '../../../settings';

type TMenuItem = { title: string; page?: TPublicPage; href?: string };

const MenuItem = ({ item }: { item: TMenuItem }): JSX.Element => {
	const dispatch = useAppDispatch();

	const { page, href, title } = item;

	const entry = (
		<>
			<div className={'menu-item-line'}>
				<span className={'menu-item-title'}>{title}</span>
				<RightIcon />
			</div>
			<Divider />
		</>
	);

	if (page) {
		return <div onClick={() => dispatch(navigate({ page, showMenu: false }))}>{entry}</div>;
	}

	if (href) {
		return (
			<a href={href} target={'_blank'}>
				{entry}
			</a>
		);
	}

	return entry;
};

function MenuPage(): JSX.Element {
	const options: TMenuItem[] = [
		{ title: 'New channel', page: 'configure' },
		{ title: 'My orders', page: 'orders' },
		{ title: 'Support', href: supportHref() } // TODO
	];

	return (
		<FormCard title={'Menu'}>
			<div className={'menu-container'}>
				<div className={'menu-list'}>
					{options.map((item) => (
						<MenuItem key={item.title} item={item} />
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
