import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import FormCard from '../../../components/form-card';
import './index.scss';
import { fiatDetails, supportedFiatTickers, TFiatCurrency } from '../../../utils/exchange-rates';
import { refreshExchangeRates, selectCurrency, setCurrency } from '../../../store/public-store';

function SettingsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const selected = useAppSelector(selectCurrency);

	const onSelect = (currency: TFiatCurrency): void => {
		dispatch(setCurrency(currency));
		dispatch(refreshExchangeRates());
	};

	return (
		<FormCard title={'Settings'} backPage={'configure'}>
			<div className={'settings-container'}>
				<h5 className={'settings-heading'}>Currency</h5>

				<p className={'settings-subheading'}>Select your preferred currency</p>

				{supportedFiatTickers.map((c) => {
					const active = selected === c;
					const name = fiatDetails[c] ? `(${fiatDetails[c].name})` : '';
					const symbol = fiatDetails[c] ? fiatDetails[c].symbol : '';

					return (
						<div
							key={c}
							className={`currency-box ${active ? 'currency-box-active' : ''}`}
							onClick={() => onSelect(c)}
						>
							<span className={'currency-name'}>
								{c} {name}
							</span>
							<span className={'currency-symbol'}>{symbol}</span>
						</div>
					);
				})}
			</div>
		</FormCard>
	);
}

export default SettingsPage;
