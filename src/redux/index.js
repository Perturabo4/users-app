import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from '@redux-saga/core'
import { all, spawn } from 'redux-saga/effects'
import postsReducer, { watchPostsFetch } from './duks/posts'
import usersReducer, { watchUsersFetch } from './duks/users'
import singlePostReducer, { watchSinglePostFetch } from './duks/singlePost'
import createUserReducer, { watchCreateUserRequest } from './duks/createUser'
import snackBarReducer from './duks/snackBar'

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  allUsers: usersReducer,
  userPosts: postsReducer,
  singlePost: singlePostReducer,
  newUser: createUserReducer,
  snackBar: snackBarReducer
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

function* rootSaga() {
  yield all([
    spawn(watchUsersFetch),
    spawn(watchPostsFetch),
    spawn(watchSinglePostFetch),
    spawn(watchCreateUserRequest)
  ])
}

sagaMiddleware.run(rootSaga)

export default store
