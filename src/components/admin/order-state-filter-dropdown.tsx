import { useEffect, useState } from 'react';
import { DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap';
import { filterOrdersByState, refreshOrders, selectOrdersFilters } from '../../store/admin-store';
import { selectInfo } from '../../store/public-store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

function OrderStateFilterDropdown(): JSX.Element {
	const [label, setLabel] = useState('Order state');
	const orderFilters = useAppSelector(selectOrdersFilters);
	const dispatch = useAppDispatch();
	const nodeInfo = useAppSelector(selectInfo);

	const orderStates: { [key: string]: number } = nodeInfo.options ? nodeInfo.options : {};

	useEffect(() => {
		const { state } = orderFilters;
		if (!state) {
			setLabel('Order state');
			return;
		}

		Object.keys(orderStates).forEach((key) => {
			if (orderStates[key] === state) {
				setLabel(key);
			}
		});
	}, [orderFilters]);

	return (
		<DropdownButton
			as={ButtonGroup}
			title={label}
			onSelect={(eventKey) => {
				if (eventKey === 'all') {
					dispatch(filterOrdersByState(undefined));
					return;
				}
				dispatch(filterOrdersByState(Number(eventKey)));
				dispatch(refreshOrders());
			}}
		>
			<Dropdown.Item eventKey={'all'}>ALL STATES</Dropdown.Item>
			{Object.keys(orderStates).map((key, index) => (
				<Dropdown.Item eventKey={orderStates[key].toString()} key={key}>
					{key}
				</Dropdown.Item>
			))}
		</DropdownButton>
	);
}

export default OrderStateFilterDropdown;
