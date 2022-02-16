import { initialState } from '../store/public-store';
import { initialState as initialAdminState } from '../store/admin-store';
import { btAdmin } from '@synonymdev/blocktank-client';

const KEY = 'redux';

export const loadState = (): any => {
	try {
		const serializedState = localStorage.getItem(KEY);
		if (!serializedState) {
			return undefined;
		}

		const completeState = JSON.parse(serializedState);

		// If we add new state with fields not previously cached
		completeState.bt = { ...initialState, ...completeState.bt };
		completeState.btAdmin = { ...initialAdminState, ...completeState.btAdmin };

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
