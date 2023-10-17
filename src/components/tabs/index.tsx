import React, { useState } from 'react';
import Divider from '../divider';
import './index.scss';

type TTabTitle = {
	title: string;
	eventKey: string;
	icon?: React.ReactElement;
	iconActive?: React.ReactElement;
};

type TTabProps = {
	children: React.ReactElement | React.ReactElement[];
} & TTabTitle;

export const Tab = ({ children, title, eventKey }: TTabProps): JSX.Element => {
	return children as JSX.Element;
};

export default ({
	children,
	defaultActiveKey
}: {
	children: React.ReactElement[];
	defaultActiveKey?: string;
}): JSX.Element => {
	const [currentKey, setCurrentKey] = useState(defaultActiveKey);

	const titles: TTabTitle[] = children.map((c) => {
		const { title, eventKey, icon, iconActive } = c.props as TTabTitle;
		return { title, eventKey, icon, iconActive };
	});

	return (
		<div className={'custom-tabs-container'}>
			<div className={'custom-tabs-heading-container'}>
				{titles.map(({ eventKey, title, icon, iconActive }) => {
					const isActive = eventKey === currentKey;
					return (
						<div
							className={`custom-tabs-heading-container ${isActive ? 'active' : ''}`}
							key={eventKey}
							onClick={() => setCurrentKey(eventKey)}
						>
							{icon && !isActive ? (
								<span className={'custom-tabs-heading-icon'}>{icon}</span>
							) : null}
							{iconActive && isActive ? (
								<span className={'custom-tabs-heading-icon'}>{iconActive}</span>
							) : null}

							<span className={'custom-tabs-heading'}>{title}</span>
						</div>
					);
				})}
			</div>

			<Divider />

			{children.map((c) => {
				const { eventKey } = c.props as TTabProps;

				return (
					<div
						key={eventKey}
						className={'custom-tab'}
						style={{ display: eventKey === currentKey ? 'block' : 'none' }}
					>
						{c}
					</div>
				);
			})}
		</div>
	);
};
