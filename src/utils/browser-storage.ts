const KEY = 'redux';

export const loadState = (): any => {
	try {
		const serializedState = localStorage.getItem(KEY);
		if (!serializedState) {
			return undefined;
		}

		return JSON.parse(serializedState);
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
