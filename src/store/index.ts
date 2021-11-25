import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import btReducer from './store';
import { loadState } from '../utils/browser-storage';

export const store = configureStore({
	reducer: {
		bt: btReducer
	},
	preloadedState: loadState()
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
