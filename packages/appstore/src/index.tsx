import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { applyMiddleware, legacy_createStore as createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import App from './app';
import rootReducer from './reducers';
import rootSaga from './sagas';
import { State } from './state';

const sagaMiddleware = createSagaMiddleware();
const store: Store<State> = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

// for debug purpose, gives a way to easily access the store
// @ts-ignore : global
window.appStore = store;

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);

const renderRoot = (app: JSX.Element) => {
  root.render(app);
};

if (process.env.NODE_ENV === 'production') {
  renderRoot((
    <Provider store={store}>
        <App />
    </Provider>
  ));
} else { // removed in production, hot-reload config
  renderRoot((
    <Provider store={store}>
      <App />
    </Provider>
  ));

  if (module.hot) {
    // app
    module.hot.accept('./app', async () => {
      // const NextApp = require('./app');
      const NextApp = (await import('./app'));
      renderRoot((
        <HotContainer>
          <Provider store={store}>
            <NextApp />
          </Provider>
        </HotContainer>
      ));
    });

    // reducers
    module.hot.accept('./reducers', () => {
      const newRootReducer = require('./reducers');
      store.replaceReducer(newRootReducer);
    });

    // // epics
    // module.hot.accept('../modules/root-epic', () => {
    //   const newRootEpic = require('./root-epic').default;
    //   epicMiddleware.replaceEpic(newRootEpic);
    // });
  }
}
