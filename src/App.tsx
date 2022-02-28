import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { debounce } from 'debounce';
import ScrollToTop from './utils/ScrollToTop';
import PublicPages from './pages/public';
import AdminPages from './pages/admin';
import { store } from './store/index';
import { saveState } from './utils/browser-storage';
import TermsPage from './pages/public/terms';
import AdminAuthModal from './components/admin/auth-modal';
import RatesRefresher from './hooks/ratesRefresher';

store.subscribe(
	debounce(() => {
		saveState(store.getState());
	}, 800)
);

function App(): JSX.Element {
	return (
		<Router>
			<ScrollToTop />
			<RatesRefresher />
			<Switch>
				<Route path='/admin'>
					<AdminAuthModal />
					<AdminPages />
				</Route>

				<Route path={['/terms-and-conditions', '/blocktank/terms-and-conditions']}>
					<TermsPage />
				</Route>

				<Route exact path={['/*']}>
					<PublicPages />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
