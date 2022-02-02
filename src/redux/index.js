import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from '@redux-saga/core'
import { all, spawn } from 'redux-saga/effects'
import postsReducer, { watchPostsFetch } from './duks/posts'
import usersReducer, { watchUsersFetch } from './duks/users'
import singlePostReducer, { watchSinglePostFetch } from './duks/singlePost'
import createUserReducer, { watchCreateUserRequest } from './duks/createUser'
import snackBarReducer from './duks/snackBar'

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
  snackBar: snackBarReducer
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
    spawn(watchUsersFetch),
    spawn(watchPostsFetch),
    spawn(watchSinglePostFetch),
    spawn(watchCreateUserRequest)
  ])
}

sagaMiddleware.run(rootSaga)
