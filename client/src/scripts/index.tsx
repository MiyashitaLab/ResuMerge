import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import './globalStyles';

import { configureStore } from './store';
import App from './containers/App';

const store = configureStore();

const render = (Component: React.ComponentClass | React.SFC) => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    document.getElementById('app')
  );
};

render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render(App);
  });
}
