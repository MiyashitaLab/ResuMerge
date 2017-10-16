import { createStore, applyMiddleware, Store, compose } from 'redux';
import thunk from 'redux-thunk';

import reducer, { RootState } from '../reduces';

const composeEnhancers: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureStore(): Store<RootState> {
  const store: Store<RootState> = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
  return store;
}
