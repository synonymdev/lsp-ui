import React from 'react';
import { ReactComponent as BackIcon } from '../../icons/back.svg';
import { navigate, TPublicPage } from '../../store/public-store';
import { useAppDispatch } from '../../store/hooks';

import './index.scss';

export default ({
	backPage,
	children
}: {
	backPage?: TPublicPage;
	children: string;
}): JSX.Element => {
	const dispatch = useAppDispatch();

	return (
		<div className={'backlink-container'}>
			{backPage ? (
				<div className={'header-backlink'} onClick={() => dispatch(navigate({ page: backPage }))}>
					<BackIcon />
				</div>
			) : null}
			<h4>{children}</h4>
		</div>
	);
};
