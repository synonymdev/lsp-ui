import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './';
import { btAdmin, IAdminLoginResponse, IAdminOrderResponse } from '@synonymdev/blocktank-client';
import { IAdminLoginRequest } from '@synonymdev/blocktank-client/dist/types';

type RequestState = 'idle' | 'loading' | 'error' | 'geoblocked';

type AuthStatus = {
	authenticated: boolean | undefined;
	sessionKey: string;
};

export type TAdminState = {
	auth: {
		state: RequestState;
		value: AuthStatus;
	};
	orders: {
		state: RequestState;
		value: IAdminOrderResponse[];
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
		value: []
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
		// TODO search filter here
		// filterOrders: (state, action: PayloadAction<string>) => {
		// 	state.info.value.capacity.local_balance += action.payload;
		// }
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
				state.orders.value = action.payload;
				state.auth.value.authenticated = true;
			})
			.addCase(refreshOrders.pending, (state, action) => {
				state.orders.state = 'loading';
			})
			.addCase(refreshOrders.rejected, (state, action) => {
				state.orders.state = 'error';
				state.orders.value = [];
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

// export const { filterOrders } = adminStore.actions;

export const selectAuth = (state: RootState): AuthStatus => state.btAdmin.auth.value;
export const selectAuthState = (state: RootState): RequestState => state.btAdmin.auth.state;

export const selectOrders = (state: RootState): IAdminOrderResponse[] => state.btAdmin.orders.value;
export const selectOrdersState = (state: RootState): RequestState => state.btAdmin.orders.state;

export default adminStore.reducer;
