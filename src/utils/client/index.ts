import {
	IBuyChannelRequest,
	IBuyChannelResponse,
	IGetInfoResponse,
	IGetOrderResponse
} from './types';

class Index {
	private host = '';

	constructor() {
		this.setNetwork('regtest');
	}

	setNetwork(network: 'mainnet' | 'testnet' | 'regtest'): void {
		switch (network) {
			case 'mainnet': {
				this.host = '';
				break;
			}
			case 'testnet': {
				this.host = '';
				break;
			}
			case 'regtest': {
				this.host = 'http://35.233.47.252:443/chainreactor/v1/';
			}
		}
	}

	static getStateMessage(code: number): string {
		switch (code) {
			case 0:
				return 'CREATED';
			case 100:
				return 'PAID';
			case 200:
				return 'URI_SET';
			case 300:
				return 'OPENED';
			case 400:
				return 'GIVE_UP';
		}

		return `Unknown code: ${code}`;
	}

	async call(path: string, method: 'GET' | 'POST', request?: any): Promise<any> {
		const tempCorsProxy = 'http://localhost:8080/';
		const url = `${tempCorsProxy}${this.host}${path}`;

		// console.log(`${this.host}${path}`);

		const fetchRes = await fetch(url, {
			method,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: request ? JSON.stringify(request) : undefined
		});

		if (fetchRes.status !== 200) {
			throw new Error(`HTTP error ${fetchRes.status}`);
		}
		const body = await fetchRes.json();

		if (!body) {
			throw new Error('Unknown HTTP error');
		}

		if (body.error) {
			throw new Error(body.error);
		}

		return body;
	}

	async getInfo(): Promise<IGetInfoResponse> {
		const res: IGetInfoResponse = await this.call('node/info', 'GET');

		// Adds a product name for display
		res.services.forEach((s) => {
			s.product_name = `Product ${s.product_id}`;
			switch (s.product_id) {
				case '60eed21d3db8ba8ac85c7322': {
					s.product_name = 'Lightning Channel';
				}
			}
		});

		return res;
	}

	async buyChannel(req: IBuyChannelRequest): Promise<IBuyChannelResponse> {
		const res: IBuyChannelResponse = await this.call('channel/buy', 'POST', req);

		res.price = Number(res.price);
		res.total_amount = Number(res.total_amount);

		return res;
	}

	async getOrder(orderId: string): Promise<IGetOrderResponse> {
		const res: IGetOrderResponse = await this.call(`channel/order?order_id=${orderId}`, 'GET');

		res.lnurl_channel =
			'lnurl1dp68gup69uhnxdfwxgenxt35xuhrydfj8g6rgve0vd5xz6twwfjkzcm5daez7a339akxuatjdshkx6rpdehx2mpldaexgetjta5kg0fkxycxxvfnxsmxyefc893nsdrz8pnxzcnzxqunzwt2awq';

		return res;
	}
}

const cr = new Index();

export default cr;
