import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './';
import bt, { IExchangeRatesResponse } from '@synonymdev/blocktank-client';
import { BlocktankClient } from '@synonymdev/blocktank-lsp-http-client';
import { TFiatCurrency } from '../utils/exchange-rates';
import { GetInfoResponse, GetOrderResponse } from '../utils/helpers';

export type RequestState = 'idle' | 'loading' | 'error';

const client = new BlocktankClient(process.env.REACT_APP_API_URL);

export type TPublicPage =
	| 'configure'
	| 'confirm'
	| 'payment'
	| 'claim'
	| 'order'
	| 'orders'
	| 'settings'
	| 'terms'
	| 'geoblocked';

export type TNavigationState = {
	page: TPublicPage;
	orderId?: string;
	showMenu?: boolean;
};

export type TSettingsState = {
	currency: TFiatCurrency;
};

export type TState = {
	navigation: TNavigationState;
	settings: TSettingsState;
	info: {
		state: RequestState;
		value: GetInfoResponse;
	};
	orders: {
		state: RequestState;
		value: GetOrderResponse[];
	};
	exchangeRates: {
		state: RequestState;
		value: IExchangeRatesResponse;
	};
};

export const initialState: TState = {
	navigation: {
		page: 'configure',
		showMenu: false
	},
	settings: {
		currency: 'USD'
	},
	info: {
		state: 'idle',
		value: {
			version: 2,
			nodes: [
				{
					alias: '',
					pubkey: '',
					connectionStrings: ['']
				}
			],
			options: {
				minChannelSizeSat: 0,
				maxChannelSizeSat: 0,
				minExpiryWeeks: 0,
				maxExpiryWeeks: 0,
				maxClientBalanceSat: 0,
				minPaymentConfirmations: 0,
				minHighRiskPaymentConfirmations: 0,
				max0ConfClientBalanceSat: 0
			}
		}
	},
	orders: {
		state: 'idle',
		value: []
	},
	exchangeRates: {
		state: 'idle',
		value: {}
	}
};

export const refreshInfo = createAsyncThunk('bt/refreshInfo', async () => {
	const response = await client.getInfo();
	// The value we return becomes the `fulfilled` action payload
	return response;
});

export const refreshOrder = createAsyncThunk('bt/refreshOrder', async (orderId: string) => {
	const response = await client.getOrder(orderId);
	return response;
});

export const refreshExchangeRates = createAsyncThunk('bt/refreshExchangeRates', async () => {
	const response = await fetch('https://blocktank.synonym.to/api/v1/rate');
	const data = await response.json();
	const exchangeRates: IExchangeRatesResponse = {};
	data.tickers.forEach((ticker) => {
		const symbol = ticker.symbol;
		const lastPrice = parseFloat(ticker.lastPrice);
		exchangeRates[symbol] = lastPrice;
	});
	return exchangeRates;
});

export const getBlocked = async (): Promise<boolean> => {
	try {
		const response = await fetch('https://api1.blocktank.to/api/geocheck', {
			method: 'OPTIONS',
			headers: {
				'Access-Control-Request-Method': 'POST',
				'Access-Control-Request-Headers': 'Content-Type'
			}
		});
		if (!response.ok) {
			throw new Error('Geo-block check failed');
		}
		return false; // Non geo-blocked
	} catch (error) {
		return true; // Geo-blocked
	}
};

export const publicStore = createSlice({
	name: 'bt',
	initialState,
	reducers: {
		navigate: (state, action: PayloadAction<TNavigationState>) => {
			state.navigation = {
				...state.navigation,
				...action.payload
			};
		},
		setShowMenu: (state, action: PayloadAction<boolean>) => {
			state.navigation.showMenu = action.payload;
		},
		setCurrency: (state, action: PayloadAction<TFiatCurrency>) => {
			state.settings.currency = action.payload;
		},
		setOrderId: (state, action: PayloadAction<string>) => {
			state.navigation.orderId = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			// Refresh info state updates
			.addCase(refreshInfo.pending, (state) => {
				state.info.state = 'loading';
			})
			.addCase(refreshInfo.rejected, (state, action) => {
				state.info.state = 'error';
			})
			.addCase(refreshInfo.fulfilled, (state, action) => {
				state.info.state = 'idle';
				state.info.value = action.payload;
			})

			// Refresh single order state updates
			.addCase(refreshOrder.pending, (state) => {
				state.orders.state = 'loading';
			})
			.addCase(refreshOrder.rejected, (state) => {
				state.orders.state = 'error';
			})
			.addCase(refreshOrder.fulfilled, (state, action) => {
				state.orders.state = 'idle';

				const updatedOrder: GetOrderResponse = action.payload as unknown as GetOrderResponse;
				const existingOrderIndex = state.orders.value.findIndex((o) => o.id === updatedOrder.id);

				if (existingOrderIndex > -1) {
					state.orders.value[existingOrderIndex] = updatedOrder;
				} else {
					state.orders.value.push(updatedOrder);
				}

				state.orders.value.sort((a, b) => {
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				});
			})

			// Refresh info exchange rates
			.addCase(refreshExchangeRates.pending, (state) => {
				state.exchangeRates.state = 'loading';
			})
			.addCase(refreshExchangeRates.rejected, (state, action) => {
				state.exchangeRates.state = 'error';
			})
			.addCase(refreshExchangeRates.fulfilled, (state, action) => {
				state.exchangeRates.state = 'idle';
				state.exchangeRates.value = action.payload;
			});
	}
});

export const { navigate, setShowMenu, setCurrency, setOrderId } = publicStore.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCurrentPage = (state: RootState): TPublicPage => state.bt.navigation.page;
export const selectShowMenu = (state: RootState): boolean => !!state.bt.navigation.showMenu;
export const selectCurrency = (state: RootState): TFiatCurrency => state.bt.settings.currency;
export const selectCurrentOrderId = (state: RootState): string => state.bt.navigation.orderId ?? '';

export const selectInfo = (state: RootState): GetInfoResponse => state.bt.info.value;
export const selectInfoState = (state: RootState): RequestState => state.bt.info.state;

export const selectOrders = (state: RootState): GetOrderResponse[] => state.bt.orders.value;
export const selectOrdersState = (state: RootState): RequestState => state.bt.orders.state;

export const selectExchangeRates = (state: RootState): IExchangeRatesResponse =>
	state.bt.exchangeRates.value;
export const selectExchangeRateState = (state: RootState): RequestState =>
	state.bt.exchangeRates.state;

export default publicStore.reducer;
