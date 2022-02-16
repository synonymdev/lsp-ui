import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import bt, { btAdmin } from '@synonymdev/blocktank-client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store';

bt.setNetwork(process.env.REACT_APP_MAINNET === 'true' ? 'mainnet' : 'testnet');
btAdmin.setNetwork(process.env.REACT_APP_MAINNET === 'true' ? 'mainnet' : 'testnet');

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
