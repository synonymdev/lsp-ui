import bt, { btAdmin } from '@synonymdev/blocktank-client';

export const supportEmail = 'suport@synonym.to';

export const supportSubject = (orderId?: string): string => {
	return `BlockTank support${orderId ? ` (Order ID ${orderId})` : ''}`;
};

export const supportHref = (orderId?: string): string => {
	return encodeURI(`mailto:${supportEmail}?subject=${supportSubject(orderId)}`);
};

type TNetwork = 'mainnet' | 'testnet';

export const network: TNetwork = process.env.REACT_APP_MAINNET === 'true' ? 'mainnet' : 'testnet';

export const setNetwork = (n?: TNetwork): void => {
	bt.setNetwork(n ?? network);
	btAdmin.setNetwork(n ?? network);
};
