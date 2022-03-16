import { initialState, TState } from '../store/public-store';
import { initialState as initialAdminState, TAdminState } from '../store/admin-store';
import { btAdmin } from '@synonymdev/blocktank-client';

const KEY = 'redux';

export const loadState = (): any => {
	try {
		const serializedState = localStorage.getItem(KEY);
		if (!serializedState) {
			return undefined;
		}

		const completeState: { bt: TState; btAdmin: TAdminState } = JSON.parse(serializedState);

		// If we add new state with fields not previously cached
		completeState.bt = { ...initialState, ...completeState.bt };

		const cachedAdminState = completeState.btAdmin;
		completeState.btAdmin = { ...initialAdminState, auth: cachedAdminState.auth };

		// If we have a stored session key set it before any API calls are made
		if (completeState.btAdmin.auth.value.sessionKey) {
			btAdmin.setSessionKey(completeState.btAdmin.auth.value.sessionKey);
		}

		return completeState;
	} catch (e) {
		console.warn('No state to load');
		return undefined;
	}
};

export const saveState = (state): void => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(KEY, serializedState);
	} catch (e) {
		console.error(e);
	}
};
