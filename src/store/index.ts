import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import btPublicReducer from './public-store';
import btAdminReducer from './admin-store';
import { loadState } from '../utils/browser-storage';

export const store = configureStore({
	reducer: {
		bt: btPublicReducer,
		btAdmin: btAdminReducer
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
