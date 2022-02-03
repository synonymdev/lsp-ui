import { initialState, State } from '../store/store';

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
