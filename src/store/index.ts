import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import btReducer from './store';

export const store = configureStore({
	reducer: {
		bt: btReducer
	}
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
