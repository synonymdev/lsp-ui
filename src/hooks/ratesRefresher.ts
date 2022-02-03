import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { refreshExchangeRates } from '../store/store';

// Rates auto refreshed every 10 seconds while the window is in focus
const interval = 10000;

const isWindowFocused = (): boolean => {
	return document.hasFocus();
};

let timer;
export default (): null => {
	const dispatch = useAppDispatch();
	const refresh = (): void => {
		if (!isWindowFocused()) {
			return;
		}

		dispatch(refreshExchangeRates()).catch((e) => console.error(e));
	};

	const stop = (): void => {
		if (timer) {
			clearInterval(timer);
		}
	};

	const start = (): void => {
		stop();
		refresh();
		timer = setInterval(refresh, interval);
	};

	useEffect(() => {
		start();
		return () => {
			stop();
		};
	}, []);

	return null;
};
