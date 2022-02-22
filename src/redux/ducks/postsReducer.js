import { List, Record } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'
import { getRequest } from '../../utils/requests'

// POSTS Reducer statuses
export const IDLE_STATUS = 'idle'
export const LOADING_STATUS = 'loading'
export const SUCCESS_STATUS = 'success'
export const FAILURE_STATUS = 'failure'

// Types
const duckName = 'postsReducer'

const POSTS_FETCH_REQUEST = `${ducksPath}/${duckName}/POSTS_FETCH_REQUEST`
const POSTS_SET_PROGRESS = `${ducksPath}/${duckName}/POSTS_SET_PROGRESS`
const POSTS_FETCH_SUCCESS = `${ducksPath}/${duckName}/POSTS_FETCH_SUCCESS`
const POSTS_FETCH_ERROR = `${ducksPath}/${duckName}/POSTS_FETCH_ERROR`

// Reducer

const record = Record({
  userId: null,
  status: IDLE_STATUS,
  inProgress: false,
  posts: List(),
  error: null
})

const initialState = record()

const postsIdleReducer = (state, action) => {
  switch (action.type) {
    case POSTS_FETCH_REQUEST:
      return state
        .set('status', LOADING_STATUS)
        .set('inProgress', false)
        .set('posts', List())
        .set('error', null)
        .set('userId', action.payload)
    default:
      return state
  }
}

const postsLoadingReducer = (state, action) => {
  switch (action.type) {
    case POSTS_SET_PROGRESS:
      return state.set('inProgress', false)
    case POSTS_FETCH_SUCCESS:
      return state
        .set('status', SUCCESS_STATUS)
        .set('inProgress', false)
        .set('posts', List(action.payload))
        .set('error', null)
    case POSTS_FETCH_ERROR:
      return state
        .set('status', FAILURE_STATUS)
        .set('posts', List())
        .set('error', action.payload)
        .set('userId', null)
    default:
      return state
  }
}

export default function postsReducer(state = initialState, action) {
  switch (state['status']) {
    case IDLE_STATUS:
      return postsIdleReducer(state, action)
    case LOADING_STATUS:
      return postsLoadingReducer(state, action)
    case SUCCESS_STATUS:
    case FAILURE_STATUS:
      return postsIdleReducer(state, action)
    default:
      return state
  }
}

// Actions

export const postsSetProgress = (userId) => ({
  type: POSTS_SET_PROGRESS
})

export const postsFetchRequest = (userId) => ({
  type: POSTS_FETCH_REQUEST,
  payload: userId
})

export const postsFetchSuccess = (posts) => ({
  type: POSTS_FETCH_SUCCESS,
  payload: posts
})

export const postsFetchError = (error) => ({
  type: POSTS_FETCH_ERROR,
  payload: error
})

// Selectors

const selectProgress = (state) => state.getIn(['userPosts', 'inProgress'])

const selectPosts = (state) => state.get('userPosts')

export const selectPostsMemo = createSelector(
  selectPosts,
  (userPosts) => userPosts['posts']
)
export const selectPostsStatus = createSelector(
  selectPosts,
  (userPosts) => userPosts['status']
)
export const selectPostsError = createSelector(
  selectPosts,
  (userPosts) => userPosts['error']
)
export const selectPostsUserId = createSelector(
  selectPosts,
  (userPosts) => userPosts['userId']
)

// Sagas

export const postsFetchSaga = function* ({ payload: userId }) {
  const progress = yield select(selectProgress)

  if (progress) return

  yield put(postsSetProgress())

  try {
    const posts = yield call(getRequest, `${baseUrlPath}/users/${userId}/posts`)

    const cropedPosts = posts.map((post) => {
      post.body = `${post.body.slice(0, 50)}...`

      return post
    })

    yield put(postsFetchSuccess(cropedPosts))
  } catch (error) {
    yield put(postsFetchError(error.message))
  }
}

export const watchPostsFetchSaga = function* () {
  yield takeEvery(POSTS_FETCH_REQUEST, postsFetchSaga)
}
