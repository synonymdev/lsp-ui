import { useState, useEffect } from 'react';
import {
	defaultDisplayValues,
	getDisplayValues,
	IDisplayValues,
	TBitcoinUnit
} from '../utils/exchange-rates';
import { useAppSelector } from '../store/hooks';
import { selectExchangeRates, selectExchangeRateState } from '../store/store';

export default function useDisplayValues(sats: number): IDisplayValues {
	const exchangeRates = useAppSelector(selectExchangeRates);
	const exchangeRatesState = useAppSelector(selectExchangeRateState);
	const [displayValues, setDisplayValues] = useState<IDisplayValues>(defaultDisplayValues);

	// TODO allow these to be set
	const bitcoinUnit: TBitcoinUnit = 'satoshi';
	const selectedCurrency = 'USD';

	useEffect((): void => {
		// Exchange rates haven't loaded yet
		if (!exchangeRates || ['error', 'geoblocked'].includes(exchangeRatesState)) {
			return;
		}

		const exchangeRate = exchangeRates[selectedCurrency];

		setDisplayValues(
			getDisplayValues({
				satoshis: sats,
				exchangeRate,
				currency: selectedCurrency,
				bitcoinUnit,
				locale: 'en-US' // TODO get from native module
			})
		);
	}, [sats, selectedCurrency, bitcoinUnit, exchangeRates]);

	return displayValues;
}
