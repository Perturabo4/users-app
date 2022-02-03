import React from 'react'
import ReactDOM from 'react-dom'
import { HistoryRouter as Router } from 'redux-first-history/rr6'
import { Provider } from 'react-redux'
import './index.css'
import App from './app/App'
import { store, history } from './app/store'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
