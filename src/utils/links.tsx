import React from 'react';

const link = (text: string, href: string): JSX.Element => (
	<a target={'_blank'} href={href}>
		{text}
	</a>
);

let subPath = '/testnet';
if (process.env.REACT_APP_MAINNET === 'true') {
	subPath = '';
}

export const txLink = (txId: string): JSX.Element =>
	link(txId, `https://mempool.space${subPath}/tx/${txId}`);
export const addressLink = (address: string): JSX.Element =>
	link(address, `https://mempool.space${subPath}/address/${address}`);
export const nodePubKeyLink = (pubKey: string): JSX.Element =>
	link(pubKey, `https://1ml.com${subPath}/node/${pubKey}`);
