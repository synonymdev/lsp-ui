import bitcoinUnits from 'bitcoin-units';

export type TFiatCurrency = 'USD' | 'EUR' | 'JPY' | 'GBP';
export const supportedFiatTickers: TFiatCurrency[] = ['USD', 'EUR', 'JPY', 'GBP'];
export const fiatDetails: { [key: string]: { symbol: string; name: string } } = {
	USD: { name: 'United States Dollar', symbol: '$' },
	EUR: { name: 'Euro', symbol: '€' },
	JPY: { name: 'Japanese Yen', symbol: '¥' },
	GBP: { name: 'Great British Pound', symbol: '£' }
};

export type TBitcoinUnit = 'satoshi' | 'BTC' | 'mBTC' | 'μBTC';

export type IDisplayValues = {
	fiatFormatted: string;
	fiatWhole: string; // Value before decimal point
	fiatDecimal: string; // Decimal point "." or ","
	fiatDecimalValue: string; // Value after decimal point
	fiatSymbol: string; // $,€,£
	fiatTicker: TFiatCurrency; // USD, EUR
	bitcoinFormatted: string;
	bitcoinSymbol: string; // ₿, m₿, μ₿, ⚡,
	bitcoinTicker: string; // BTC, mBTC, μBTC, Sats
	altBitcoinFormatted: string;
	altBitcoinSymbol: string; // ₿, m₿, μ₿, ⚡,
	altBitcoinTicker: string; // BTC, mBTC, μBTC, Sats
	satoshis: number;
};

export const defaultDisplayValues: IDisplayValues = {
	fiatFormatted: '-',
	fiatWhole: '',
	fiatDecimal: '',
	fiatDecimalValue: '',
	fiatSymbol: '',
	fiatTicker: 'USD',
	bitcoinFormatted: '-',
	bitcoinSymbol: '',
	bitcoinTicker: '',
	altBitcoinFormatted: '-',
	altBitcoinSymbol: '',
	altBitcoinTicker: '',
	satoshis: 0
};

const numberWithSpaces = (x: number): string => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
	currency: TFiatCurrency;
	bitcoinUnit: TBitcoinUnit;
	locale?: string;
}): IDisplayValues => {
	try {
		bitcoinUnits.setFiat(currency, exchangeRate);
		const fiatValue = exchangeRate
			? bitcoinUnits(satoshis, 'satoshi').to(currency).value().toFixed(2)
			: '-';

		let {
			fiatFormatted,
			fiatWhole,
			fiatDecimal,
			fiatDecimalValue,
			fiatSymbol,
			altBitcoinFormatted
		} = defaultDisplayValues;

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

		let bitcoinFormatted = bitcoinUnits(satoshis, 'satoshi')
			.to(bitcoinUnit)
			.value()
			.toFixed(bitcoinUnit === 'satoshi' ? 0 : 8)
			.toString();

		let { bitcoinSymbol, altBitcoinSymbol } = defaultDisplayValues;
		let bitcoinTicker = bitcoinUnit.toString();
		let altBitcoinTicker: TBitcoinUnit = 'BTC';
		switch (bitcoinUnit) {
			case 'BTC':
				bitcoinSymbol = '₿';

				// Bitcoin's alt format is sats
				altBitcoinSymbol = 'Sats';
				altBitcoinTicker = 'satoshi';
				altBitcoinFormatted = numberWithSpaces(satoshis);
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
				bitcoinFormatted = numberWithSpaces(satoshis);

				// Sats alt format is whole bitcoins
				altBitcoinSymbol = '₿';
				altBitcoinTicker = 'BTC';
				altBitcoinFormatted = `${(satoshis / 100000000).toFixed(8)}`;
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
			altBitcoinFormatted,
			altBitcoinSymbol,
			altBitcoinTicker,
			satoshis
		};
	} catch (e) {
		console.error(e);
		return defaultDisplayValues;
	}
};
