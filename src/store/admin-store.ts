import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './';
import { btAdmin, IAdminLoginResponse, IAdminOrderResponse } from '@synonymdev/blocktank-client';
import { IAdminLoginRequest } from '@synonymdev/blocktank-client/dist/types';

type RequestState = 'idle' | 'loading' | 'error' | 'geoblocked';

type AuthStatus = {
	authenticated: boolean | undefined;
	sessionKey: string;
};

export type State = {
	auth: {
		state: RequestState;
		value: AuthStatus;
	};
	orders: {
		state: RequestState;
		value: IAdminOrderResponse[];
	};
};

export const initialState: State = {
	auth: {
		state: 'idle',
		value: {
			authenticated: undefined,
			sessionKey: ''
		}
	},
	orders: {
		state: 'idle',
		value: []
	}
};

export const refreshSession = createAsyncThunk(
	'btAdmin/refreshSession',
	async(sessionKey: string) => {
		btAdmin.setSessionKey(sessionKey);

		// TODO maybe use another endpoint to check for active session
		await btAdmin.getOrders();

		return sessionKey;
	}
);

export const login = createAsyncThunk(
	'btAdmin/login',
	async(req: IAdminLoginRequest): Promise<IAdminLoginResponse> => {
		return await btAdmin.login(req);
	}
);

export const refreshOrders = createAsyncThunk('btAdmin/refreshOrders', async() => {
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
			.addCase(refreshSession.fulfilled, (state, action) => {
				state.auth.state = 'idle';
				state.auth.value = {
					authenticated: true,
					sessionKey: action.payload
				};
			})
			.addCase(refreshSession.pending, (state, action) => {
				state.auth.state = 'loading';
				state.auth.value = {
					...state.auth.value,
					authenticated: undefined
				};
			})
			.addCase(refreshSession.rejected, (state, action) => {
				state.auth.state = 'error';
				state.auth.value = {
					authenticated: false,
					sessionKey: ''
				};
			})
			.addCase(refreshOrders.fulfilled, (state, action) => {
				state.orders.state = 'idle';
				state.orders.value = action.payload;
			})
			.addCase(refreshOrders.pending, (state, action) => {
				state.orders.state = 'loading';
			})
			.addCase(refreshOrders.rejected, (state, action) => {
				state.orders.state = 'error';
				// TODO catch 403 errors and set auth state to false
				if (action.error.message === 'Network request failed') {
					state.auth.value = {
						...state.auth.value,
						authenticated: false
					};
				}
			});
	}
});

// export const { filterOrders } = adminStore.actions;

export const selectAuth = (state: RootState): AuthStatus => state.btAdmin.auth.value;
export const selectAuthState = (state: RootState): RequestState => state.btAdmin.auth.state;

export const selectOrders = (state: RootState): IAdminOrderResponse[] => state.btAdmin.orders.value;
export const selectOrdersState = (state: RootState): RequestState => state.btAdmin.orders.state;

export default adminStore.reducer;
