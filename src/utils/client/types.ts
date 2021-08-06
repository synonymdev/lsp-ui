export type IService = {
	available: boolean;
	product_id: string;
	product_name: string;
	min_channel_size: number;
	max_channel_size: number;
	min_chan_expiry: number;
	max_chan_expiry: number;
	order_states: {
		CREATED: number;
		PAID: number;
		URI_SET: number;
		OPENED: number;
		GIVE_UP: number;
	};
};

export type IGetInfoResponse = {
	capacity: {
		local_balance: number;
		remote_balance: number;
	};
	services: IService[];
	node_info: {
		alias: string;
		active_channels_count: number;
		uris: string[];
		public_key: string;
	};
};

export type IBuyChannelRequest = {
	product_id: string;
	remote_balance: number;
	local_balance: number;
	channel_expiry: number;
};

export type IBuyChannelResponse = {
	order_id: string;
	ln_invoice: string;
	price: number;
	total_amount: number;
	btc_address: string;
	lnurl_channel: string;
};

type IOnchainPayment = {
	height: number;
	hash: string;
	to: string;
	amount_base: number;
	fee_base: number;
	confirmed: true;
};

type ILnurl = {
	uri: string;
	callback: string;
	k1: string;
	tag: string;
};

export type IGetOrderResponse = {
	_id: string;
	local_balance: number;
	remote_balance: number;
	channel_expiry: number;
	channel_expiry_ts: number;
	order_expiry: number;
	price: number;
	created_at: number;
	state: number;
	stateMessage: string; // Debug message derived from state value
	purchase_invoice: string;
	amount_received: number;
	onchain_payments: IOnchainPayment[];
	lnurl: ILnurl;
};
