import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './';
import { btAdmin, IAdminLoginResponse, IAdminOrderResponse } from '@synonymdev/blocktank-client';
import { IAdminLoginRequest } from '@synonymdev/blocktank-client/dist/types';

type RequestState = 'idle' | 'loading' | 'error' | 'geoblocked';

type TAuthStatus = {
	authenticated: boolean | undefined;
	sessionKey: string;
};

type TOrderFilters = {
	state: number | undefined;
	// TODO add more filters here
};

export type TAdminState = {
	auth: {
		state: RequestState;
		value: TAuthStatus;
	};
	orders: {
		state: RequestState;
		value: {
			list: IAdminOrderResponse[];
			filters: TOrderFilters;
		};
	};
};

export const initialState: TAdminState = {
	auth: {
		state: 'idle',
		value: {
			authenticated: false,
			sessionKey: ''
		}
	},
	orders: {
		state: 'idle',
		value: {
			list: [],
			filters: {
				state: undefined
			}
		}
	}
};

export const login = createAsyncThunk(
	'btAdmin/login',
	async(req: IAdminLoginRequest): Promise<IAdminLoginResponse> => {
		return await btAdmin.login(req);
	}
);

export const refreshOrders = createAsyncThunk('btAdmin/refreshOrders', async() => {
	if (!btAdmin.getSessionKey()) {
		throw new Error('Missing session key');
	}

	const response = await btAdmin.getOrders();
	return response;
});

export const adminStore = createSlice({
	name: 'btAdmin',
	initialState,
	reducers: {
		filterOrdersByState: (state, action: PayloadAction<number | undefined>) => {
			state.orders.value.filters.state = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.fulfilled, (state, action) => {
				state.auth.state = 'idle';
				state.auth.value = {
					authenticated: true,
					sessionKey: action.payload.key
				};
			})
			.addCase(login.pending, (state, action) => {
				state.auth.state = 'loading';
				state.auth.value = {
					...state.auth.value,
					authenticated: undefined
				};
			})
			.addCase(login.rejected, (state, action) => {
				state.auth.state = 'error';
				state.auth.value = {
					...state.auth.value,
					authenticated: false
				};
			})
			.addCase(refreshOrders.fulfilled, (state, action) => {
				state.orders.state = 'idle';
				state.orders.value.list = action.payload;
				state.auth.value.authenticated = true;
			})
			.addCase(refreshOrders.pending, (state, action) => {
				state.orders.state = 'loading';
			})
			.addCase(refreshOrders.rejected, (state, action) => {
				state.orders.state = 'error';
				state.orders.value.list = [];
				// TODO catch 403 errors and set auth state to false
				if (action.error.message === 'Network request failed') {
					state.auth.value = {
						...state.auth.value,
						authenticated: false,
						sessionKey: ''
					};
				}

				console.warn(JSON.stringify(action.error));
			});
	}
});

export const { filterOrdersByState } = adminStore.actions;

export const selectAuth = (state: RootState): TAuthStatus => state.btAdmin.auth.value;
export const selectAuthState = (state: RootState): RequestState => state.btAdmin.auth.state;

export const selectOrders = (state: RootState): IAdminOrderResponse[] => {
	const { state: orderState } = state.btAdmin.orders.value.filters;
	if (orderState) {
		return state.btAdmin.orders.value.list.filter((o) => o.state === orderState);
	}

	return state.btAdmin.orders.value.list;
};

export const selectOrdersFilters = (state: RootState): TOrderFilters => {
	return state.btAdmin.orders.value.filters;
};
export const selectOrdersState = (state: RootState): RequestState => state.btAdmin.orders.state;

export default adminStore.reducer;
