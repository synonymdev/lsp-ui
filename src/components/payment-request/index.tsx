import React from 'react';
import bip21 from 'bip21';
import QRCode from '../qr';
import CopyButton from '../copy-button';
import './index.scss';
import { clipCenter } from '../../utils/helpers';

const qrSize = 180;

type TOnchainRequest = {
	address: string;
	sats: number;
};

type TLightningRequest = {
	invoice: string;
};

export default ({
	orderId,
	onchain,
	lightning
}: {
	orderId: string;
	onchain?: TOnchainRequest;
	lightning?: TLightningRequest;
}): JSX.Element => {
	let qrValue = '';
	let title = '';
	let text = '';
	const tooltip = '';
	let copyButtonTitle = '';

	if (onchain) {
		const { address, sats } = onchain;
		qrValue = bip21.encode(address, {
			amount: sats / 100000000,
			label: `Blocktank #${orderId}`
		});
		title = 'Bitcoin address';
		text = address;
		copyButtonTitle = 'Copy address';
	} else if (lightning) {
		const { invoice } = lightning;
		qrValue = `lightning:${invoice}`;
		title = 'Invoice';
		text = invoice;
		copyButtonTitle = 'Copy invoice';
	}

	return (
		<div className='payment-request-container'>
			<div className={'payment-request-qr'}>
				<QRCode value={qrValue} size={qrSize} />
			</div>
			<div className={'payment-request-details'}>
				<span className={'payment-request-title'}>{title}</span>
				<p className={'payment-request-address'}>{clipCenter(text, 45)}</p>
				<CopyButton value={text}>{copyButtonTitle}</CopyButton>
			</div>
		</div>
	);
};
