import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from '@redux-saga/core'
import { all, spawn } from 'redux-saga/effects'

import postsReducer, { watchPostsFetchSaga } from './ducks/postsReducer'
import usersReducer, { watchUsersFetchSaga } from './ducks/usersReducer'
import singlePostReducer, {
  watchPostFetchSaga
} from './ducks/singlePostReducer'
import createUserReducer, {
  watchCreateUserSaga
} from './ducks/createUserReducer'
import snackBarReducer from './ducks/snackBarReducer'
import swapiReduser, { watchPersonsSaga } from './ducks/swapiPersonsReducer'

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
    selectRouterState: (state) => state.get('router'),
    reduxTravelling: true
  })

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  router: routerReducer,
  allUsers: usersReducer,
  userPosts: postsReducer,
  singlePost: singlePostReducer,
  newUser: createUserReducer,
  snackBar: snackBarReducer,
  swapiPersons: swapiReduser
})

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(routerMiddleware),
    applyMiddleware(sagaMiddleware)
  )
)

export const history = createReduxHistory(store)

function* rootSaga() {
  yield all([
    spawn(watchUsersFetchSaga),
    spawn(watchPostsFetchSaga),
    spawn(watchPostFetchSaga),
    spawn(watchCreateUserSaga),
    spawn(watchPersonsSaga)
  ])
}

sagaMiddleware.run(rootSaga)
