import TimeAgo, { Unit } from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

import { RequestState } from '../store/public-store';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const orderExpiryFormatLabels = (unit: Unit): any => {
	return {
		past: {
			one: `expired {0} ${unit} ago`,
			other: `expired {0} ${unit}s ago`
		},
		future: {
			one: `expires in {0} ${unit}`,
			other: `expires in {0} ${unit}s`
		}
	};
};

const orderExpiryLabels = {
	year: orderExpiryFormatLabels('year'),
	month: orderExpiryFormatLabels('month'),
	week: orderExpiryFormatLabels('week'),
	day: orderExpiryFormatLabels('day'),
	hour: orderExpiryFormatLabels('hour'),
	minute: orderExpiryFormatLabels('minute'),
	second: orderExpiryFormatLabels('second'),
	now: 'is expired'
};

TimeAgo.addLabels('en', 'long', orderExpiryLabels);

export const clipCenter = (str: string, maxLength: number): string => {
	if (!str) {
		return '';
	}

	if (str.length > maxLength) {
		const center = Math.round(maxLength / 2);
		return `${str.substr(0, center)}...${str.substr(str.length - center, str.length)}`;
	}

	return str;
};

export const orderExpiryFormat = (timestamp: string): string => {
	return timeAgo.format(new Date(timestamp)).toString();
};

export const numberWithSpaces = (num: number): string => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const currencySymbols = {
	USD: '$',
	EUR: '€',
	JPY: '¥',
	GBP: '£'
};

export type GetInfoResponse = {
	version: number;
	nodes: Array<{
		alias: string;
		pubkey: string;
		connectionStrings: string[];
	}>;
	options: {
		minChannelSizeSat: number;
		maxChannelSizeSat: number;
		minExpiryWeeks: number;
		maxExpiryWeeks: number;
		maxClientBalanceSat: number;
		minPaymentConfirmations: number;
		minHighRiskPaymentConfirmations: number;
		max0ConfClientBalanceSat: number;
	};
};

export type GetOrderResponse = {
	id: string;
	state: string;
	feeSat: number;
	lspBalanceSat: number;
	clientBalanceSat: number;
	zeroConf: boolean;
	channelExpiryWeeks: number;
	channelExpiresAt: string;
	orderExpiresAt: string;
	lspNode: {
		alias: string;
		pubkey: string;
		connectionStrings: string[];
	};
	lnurl: string;
	payment: {
		state: string;
		paidSat: number;
		bolt11Invoice: {
			request: string;
			state: string;
			expiresAt: string;
			updatedAt: string;
		};
		onchain: {
			address: string;
			confirmedSat: number;
			requiredConfirmations: number;
			transactions: any[];
		};
	};
	couponCode: string;
	discountPercent: number;
	updatedAt: string;
	createdAt: string;
};

export type UseOrder = {
	order: UseOrderResponse | undefined;
	orderState: RequestState;
};

export type UseOrderResponse = {
	id: string;
	state: string;
	feeSat: number;
	lspBalanceSat: number;
	clientBalanceSat: number;
	zeroConf: boolean;
	channelExpiryWeeks: number;
	channelExpiresAt: string;
	orderExpiresAt: string;
	lspNode: {
		alias: string;
		pubkey: string;
		connectionStrings: string[];
	};
	lnurl: string;
	payment: {
		state: string;
		paidSat: number;
		bolt11Invoice: {
			request: string;
			state: string;
			expiresAt: string;
			updatedAt: string;
		};
		onchain: {
			address: string;
			confirmedSat: number;
			requiredConfirmations: number;
			transactions: any[];
		};
	};
	couponCode: string;
	discountPercent: number;
	updatedAt: string;
	createdAt: string;
};

export const statusLabels = {
	created: {
		pending: 'Awaiting payment',
		holding: 'Claim channel'
	},
	expired: {
		pending: 'Order expired',
		canceled: 'Order expired'
	},
	close: {
		pending: 'Channel closed',
		cancelled: 'Channel closed'
	},
	open: {
		paid: 'Channel open'
	}
};
