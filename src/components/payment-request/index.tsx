import React from 'react';
import bip21 from 'bip21';
import QRCode from '../qr';
import ActionButton from '../action-button';
import Divider from '../divider';
import './index.scss';
import { clipCenter, orderExpiryFormat } from '../../utils/helpers';
import Tooltip from '../tooltip';
import { ReactComponent as LightningIconActive } from '../../icons/lightning-active.svg';
import { ReactComponent as TransferIconActive } from '../../icons/transfer-active.svg';
import useDisplayValues from '../../hooks/displayValues';

const qrSize = 200;

type TOnchainRequest = {
	address: string;
	sats: number;
	zeroConfMinFee: number | undefined;
	receivingAmount: number | undefined; // TODO
};

type TLightningRequest = {
	invoice: string;
};

export default ({
	orderId,
	orderExpiry,
	orderStatus,
	orderTotal,
	onchain,
	lightning
}: {
	orderId: string;
	orderExpiry: number;
	orderStatus: string;
	orderTotal: number;
	onchain?: TOnchainRequest;
	lightning?: TLightningRequest;
}): JSX.Element => {
	let qrValue = '';
	let title = '';
	let text = '';
	let copyButtonTitle = '';
	let message = `This order ${orderExpiryFormat(orderExpiry)}.`;
	const orderTotalDisplay = useDisplayValues(orderTotal);

	if (onchain) {
		const { address, sats, zeroConfMinFee, receivingAmount } = onchain;
		qrValue = bip21.encode(address, {
			amount: sats / 100000000,
			label: `Blocktank #${orderId}`
		});
		title = 'Bitcoin address';
		text = address;
		copyButtonTitle = 'Copy address';

		if (receivingAmount) {
			if (receivingAmount < orderTotal) {
				message = `${message} Received ${receivingAmount} of ${orderTotal} sats.`;
			} else if (receivingAmount === orderTotal) {
				message =
					'Full payment received. Please wait for your on-chain Bitcoin payment to confirm (needs at least 1 confirmation).';
			}
		} else if (zeroConfMinFee) {
			message = `${message} Set your transaction fee to more than ${zeroConfMinFee} sats/byte to receive your Lightning channel instantly.`;
		}
	} else if (lightning) {
		const { invoice } = lightning;
		qrValue = `lightning:${invoice}`;
		title = 'Invoice';
		text = invoice;
		copyButtonTitle = 'Copy invoice';
	}

	return (
		<div className='payment-request-container'>
			<div className='payment-request-top'>
				<div className={'payment-request-qr'}>
					<QRCode value={qrValue} size={qrSize} />
				</div>
				<div className={'payment-request-details'}>
					<div className={'payment-request-title'}>
						<span>{title}</span>
						<Tooltip
							tip={{
								title: 'How to pay',
								body: 'You can pay for your new channel using Lightning or with an on-chain Bitcoin payment. After your payment is confirmed, you can claim your channel.'
							}}
						/>
					</div>
					<p className={'payment-request-address'}>{clipCenter(text, 42)}</p>
					<ActionButton copyText={text}>{copyButtonTitle}</ActionButton>
				</div>
			</div>

			<Divider />

			<div className={'payment-request-middle'}>
				<div>
					<h4 className={'payment-request-title'}>Total amount to pay</h4>
					<span className={'payment-request-middle-value'}>
						<LightningIconActive className={'payment-request-middle-value-icon'} />
						{orderTotalDisplay.bitcoinFormatted}
					</span>
				</div>
				<div>
					<h4 className={'payment-request-title'}>Order status</h4>
					<span className={'payment-request-middle-value'}>
						<TransferIconActive className={'payment-request-middle-value-icon'} />
						{orderStatus}
					</span>
				</div>
			</div>

			<p className={'payment-request-bottom-message'}>{message}</p>
		</div>
	);
};
