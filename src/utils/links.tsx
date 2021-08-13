import React from 'react';

const link = (text: string, href: string): JSX.Element => (
	<a target={'_blank'} href={href}>
		{text}
	</a>
);

export const txLink = (txId: string): JSX.Element =>
	link(txId, `https://mempool.space/testnet/tx/${txId}`);
export const addressLink = (address: string): JSX.Element =>
	link(address, `https://mempool.space/testnet/address/${address}`);
export const nodePubKeyLink = (pubKey: string): JSX.Element =>
	link(pubKey, `https://1ml.com/testnet/node/${pubKey}`);
