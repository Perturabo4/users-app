import { fromJS, List, Record } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'
import { getRequest } from '../../utils/requests'

// Types
const duckName = 'posts'

const POSTS_FETCH_REQUEST = `${ducksPath}/${duckName}/POSTS_FETCH_REQUEST`
const POSTS_FETCH_SUCCESS = `${ducksPath}/${duckName}/POSTS_FETCH_SUCCESS`
const POSTS_FETCH_ERROR = `${ducksPath}/${duckName}/POSTS_FETCH_ERROR`

// Reducer

const record = Record({
  userId: 1,
  load: false,
  posts: fromJS([]),
  error: null
})

const initialState = record()

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case POSTS_FETCH_REQUEST:
      return state.set('load', true).set('userId', action.payload)
    case POSTS_FETCH_SUCCESS:
      return state.set('load', false).set('posts', List(action.payload))
    case POSTS_FETCH_ERROR:
      return state.set('load', false).set('error', action.payload)
    default:
      return state
  }
}

// Actions

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

export const selectPosts = (state) => state.get('userPosts')

export const selectPostsMemo = createSelector(
  selectPosts,
  (userPosts) => userPosts['posts']
)
export const selectPostsLoad = createSelector(
  selectPosts,
  (userPosts) => userPosts['load']
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

let idle = false
export const postsFetchSaga = function* () {
  if (idle) return
  idle = true

  try {
    const userId = yield select(selectPostsUserId)
    const posts = yield call(getRequest, `${baseUrlPath}/users/${userId}/posts`)

    const cropedPosts = posts.map((post) => {
      post.body = `${post.body.slice(0, 50)}...`

      return post
    })

    yield put(postsFetchSuccess(cropedPosts))
  } catch (error) {
    yield put(postsFetchError(error.message))
  } finally {
    idle = false
  }
}

export const watchPostsFetchSaga = function* () {
  yield takeEvery(POSTS_FETCH_REQUEST, postsFetchSaga)
}
