import bitcoinUnits from 'bitcoin-units';
export const supportedExchangeTickers = ['USD', 'EUR', 'JPY', 'GBP'];

export type IExchangeRatesResponse = {
	[key: string]: number;
};

export const fetchBitfinexRates = async(): Promise<IExchangeRatesResponse> => {
	const rates: IExchangeRatesResponse = {};

	const dummyPath = '/dummy-rates.json';
	const path = 'https://api-pub.bitfinex.com/v2/tickers';

	const response = await fetch(
		`${dummyPath}?symbols=${supportedExchangeTickers.map((c) => `tBTC${c}`).join(',')}`
	);

	const jsonResponse = (await response.json()) as string[][];
	jsonResponse.forEach((a) => {
		rates[a[0].replace('tBTC', '')] = Math.round(Number(a[10]) * 100) / 100;
	});

	return rates;
};

export type TBitcoinUnit = 'satoshi' | 'BTC' | 'mBTC' | 'μBTC';

export type IDisplayValues = {
	fiatFormatted: string;
	fiatWhole: string; // Value before decimal point
	fiatDecimal: string; // Decimal point "." or ","
	fiatDecimalValue: string; // Value after decimal point
	fiatSymbol: string; // $,€,£
	fiatTicker: string; // USD, EUR
	bitcoinFormatted: string;
	bitcoinSymbol: string; // ₿, m₿, μ₿, ⚡,
	bitcoinTicker: string; // BTC, mBTC, μBTC, Sats
	satoshis: number;
};

export const defaultDisplayValues: IDisplayValues = {
	fiatFormatted: '-',
	fiatWhole: '',
	fiatDecimal: '',
	fiatDecimalValue: '',
	fiatSymbol: '',
	fiatTicker: '',
	bitcoinFormatted: '-',
	bitcoinSymbol: '',
	bitcoinTicker: '',
	satoshis: 0
};

export const getDisplayValues = ({
	satoshis,
	exchangeRate,
	currency,
	bitcoinUnit,
	locale = 'en-US'
}: {
	satoshis: number;
	exchangeRate?: number;
	currency: string;
	bitcoinUnit: TBitcoinUnit;
	locale?: string;
}): IDisplayValues => {
	try {
		bitcoinUnits.setFiat(currency, exchangeRate);
		const fiatValue = exchangeRate
			? bitcoinUnits(satoshis, 'satoshi').to(currency).value().toFixed(2)
			: '-';

		let { fiatFormatted, fiatWhole, fiatDecimal, fiatDecimalValue, fiatSymbol } =
			defaultDisplayValues;

		if (!isNaN(fiatValue)) {
			const fiatFormattedIntl = new Intl.NumberFormat(locale, {
				style: 'currency',
				currency
			});
			fiatFormatted = fiatFormattedIntl.format(fiatValue);

			fiatFormattedIntl.formatToParts(fiatValue).forEach((part) => {
				if (part.type === 'currency') {
					fiatSymbol = part.value;
				} else if (part.type === 'integer' || part.type === 'group') {
					fiatWhole = `${fiatWhole}${part.value}`;
				} else if (part.type === 'fraction') {
					fiatDecimalValue = part.value;
				} else if (part.type === 'decimal') {
					fiatDecimal = part.value;
				}
			});

			fiatFormatted = isNaN(fiatValue) ? '-' : fiatFormatted.replace(fiatSymbol, '');
		}

		const bitcoinFormatted = bitcoinUnits(satoshis, 'satoshi')
			.to(bitcoinUnit)
			.value()
			.toFixed(bitcoinUnit === 'satoshi' ? 0 : 8)
			.toString();

		let { bitcoinSymbol } = defaultDisplayValues;
		let bitcoinTicker = bitcoinUnit.toString();
		switch (bitcoinUnit) {
			case 'BTC':
				bitcoinSymbol = '₿';
				break;
			case 'mBTC':
				bitcoinSymbol = 'm₿';
				break;
			case 'μBTC':
				bitcoinSymbol = 'μ₿';
				break;
			case 'satoshi':
				bitcoinSymbol = '⚡';
				bitcoinTicker = 'Sats';
				break;
		}

		return {
			fiatFormatted,
			fiatWhole,
			fiatDecimal,
			fiatDecimalValue,
			fiatSymbol,
			fiatTicker: currency,
			bitcoinFormatted,
			bitcoinSymbol,
			bitcoinTicker,
			satoshis
		};
	} catch (e) {
		console.error(e);
		return defaultDisplayValues;
	}
};
