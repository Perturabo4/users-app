import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from '@redux-saga/core'
import { all, spawn } from 'redux-saga/effects'
import postsReducer, { watchPostsFetchSaga } from '../duks/postsPage/posts'
import usersReducer, { watchUsersFetchSaga } from '../duks/usersPage/users'
import singlePostReducer, {
  watchSinglePostFetchSaga
} from '../duks/singlePostPage/singlePost'
import createUserReducer, {
  watchCreateUserSaga
} from '../duks/createUserPage/createUser'
import snackBarReducer from '../duks/customizedSnackbar/snackBar'

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
    spawn(watchUsersFetchSaga),
    spawn(watchPostsFetchSaga),
    spawn(watchSinglePostFetchSaga),
    spawn(watchCreateUserSaga)
  ])
}

sagaMiddleware.run(rootSaga)
