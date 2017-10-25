import React from 'react';
import ReactDOM from 'react-dom';
import 'react-select/dist/react-select.css';
import 'react-table/react-table.css';
import registerServiceWorker from './registerServiceWorker';
import styles from './styles';
import App from './containers/App';

const rootEl = document.getElementById('root');

ReactDOM.render(<App />, rootEl);

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}
registerServiceWorker();
