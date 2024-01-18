import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
	navigate,
	refreshOrder,
	selectOrders,
	selectOrdersState,
	TPublicPage
} from '../../../store/public-store';
import FormCard from '../../../components/form-card';
import Spinner from '../../../components/spinner';
import Divider from '../../../components/divider';
import Button from '../../../components/action-button';
import { statusLabels } from '../../../utils/helpers';
import { ReactComponent as TransferActive } from '../../../icons/transfer-active.svg';
import { ReactComponent as TransferIconActivePurple } from '../../../icons/transfer-active-purple.svg';
import { ReactComponent as Lightning } from '../../../icons/lightning.svg';
import { ReactComponent as LightningActive } from '../../../icons/lightning-active.svg';
import { ReactComponent as LightningGreen } from '../../../icons/lightning-green.svg';
import { ReactComponent as LightningRed } from '../../../icons/lightning-red.svg';

import './index.scss';

const ListItem = ({
	id,
	Icon,
	title,
	subHeading,
	label,
	onClick,
	buttonText,
	hasScrollBar
}: {
	id: string;
	Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
	title: string;
	subHeading: string;
	label: string;
	onClick: () => void;
	buttonText: string;
	hasScrollBar: boolean;
}): JSX.Element => {
	const randomStringId = Math.random().toString(36).substring(7);
	return (
		<div
			key={`${id}-${randomStringId}`}
			className={`order-list-item ${hasScrollBar ? 'with-scrollbar' : ''}`}
		>
			<p className={'order-list-item-date'}>{title}</p>
			<div className={'order-list-content'}>
				<div className={'order-list-details'}>
					<span className={'order-status-heading'}>{subHeading}</span>
					<span className={'order-status-value'}>
						<Icon className={'order-status-icon'} />
						{label}
					</span>
				</div>

				<Button onClick={onClick}>{buttonText}</Button>
			</div>
			<Divider />
		</div>
	);
};

function OrdersPage(): JSX.Element {
	const orders = useAppSelector(selectOrders);
	const ordersState = useAppSelector(selectOrdersState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		orders.forEach((o) => {
			dispatch(refreshOrder(o.id)).catch((e) => alert(e));
		});
	}, []);

	if (ordersState === 'loading') {
		return (
			<FormCard>
				<Spinner style={{ fontSize: 8 }} centered />
			</FormCard>
		);
	}

	// After 4 orders we need to add padding on the right for the scrollbar
	const hasScrollbar = orders.length > 4;

	return (
		<FormCard title={'My orders'} backPage={'configure'}>
			<div className={'orders-container'}>
				{orders.length === 0 ? (
					<ListItem
						key={'no-order'}
						id={'no-order'}
						Icon={LightningActive}
						title={'No orders yet'}
						subHeading={'New channel'}
						label={'Lightning channel'}
						buttonText={'Create channel'}
						onClick={() => dispatch(navigate({ page: 'configure' }))}
						hasScrollBar={hasScrollbar}
					/>
				) : null}
				{orders.map(
					({
						id,
						state,
						createdAt,
						payment: { state: statePayment },
						payment: { state2: statePayment2 },
						payment: {
							onchain: { confirmedSat }
						}
					}) => {
						const date = new Date(createdAt);
						let buttonText = 'Order details';
						let Icon = Lightning;
						let page: TPublicPage = 'order';

						const getStatusLabel = (): string => {
							if (statusLabels[state]) {
								if (statusLabels[state][statePayment2]) {
									return statusLabels[state][statePayment2];
								}
							}
							return statePayment2;
						};

						if (state === 'created') {
							if (statePayment === 'paid') {
								Icon = LightningActive;
								buttonText = 'Claim channel';
								page = 'claim';
							} else if (statePayment2 === 'created' && confirmedSat === 0) {
								// Awaiting payment
								buttonText = 'Pay now';

								const themeParam = new URLSearchParams(window.location.search).get('theme') ?? '';
								if (themeParam === 'ln-dark' || themeParam === 'ln-light') {
									Icon = TransferIconActivePurple;
								} else {
									Icon = TransferActive;
								}
								page = 'payment';
							}
						} else if (state === 'open') {
							Icon = LightningGreen;
						} else if (state === 'closed') {
							Icon = LightningRed;
						}

						return (
							<ListItem
								key={id}
								id={id}
								Icon={Icon}
								onClick={() => dispatch(navigate({ page, orderId: id }))}
								title={date.toLocaleString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
								subHeading={'Order status'}
								label={getStatusLabel()}
								buttonText={buttonText}
								hasScrollBar={hasScrollbar}
							/>
						);
					}
				)}
			</div>
		</FormCard>
	);
}

export default OrdersPage;
