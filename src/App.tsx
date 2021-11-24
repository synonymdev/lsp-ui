import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { debounce } from 'debounce';
import ScrollToTop from './utils/ScrollToTop';
import PublicPages from './pages/public';
import AdminPages from './pages/admin';
import { store } from './store/index';
import { saveState } from './utils/browser-storage';

store.subscribe(
	debounce(() => {
		saveState(store.getState());
	}, 800)
);

function App(): JSX.Element {
	return (
		<Router>
			<ScrollToTop />
			<Switch>
				<Route path='/admin'>
					<AdminPages />
				</Route>

				<Route exact path={['/*', '/blocktank/*']}>
					<PublicPages />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
