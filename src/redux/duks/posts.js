import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath } from '../../api'

// Types

export const POSTS_FETCH = 'POSTS_FETCH'
export const POSTS_FETCHED = 'POSTS_FETCHED'
export const POSTS_FETCH_ERROR = 'POSTS_FETCH_ERROR'

// Reducer

const initialState = fromJS({
  userId: 1,
  load: false,
  posts: [],
  error: null
})

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case POSTS_FETCH:
      return state.set('load', true).set('userId', action.payload)
    case POSTS_FETCHED:
      return state.set('load', false).set('posts', fromJS(action.payload))
    case POSTS_FETCH_ERROR:
      return state.set('load', false).set('error', action.payload)
    default:
      return state
  }
}

// Actions

<<<<<<< HEAD:src/duks/postsPage/posts.js
export const postsFetchRequest = (userId) => ({
  type: POSTS_FETCH_REQUEST,
  payload: userId
})
export const postsFetchSuccess = (posts) => ({
  type: POSTS_FETCH_SUCCESS,
  payload: posts
})
=======
export const postsFetch = (userId) => ({ type: POSTS_FETCH, payload: userId })
export const postsFetched = (posts) => ({ type: POSTS_FETCHED, payload: posts })
>>>>>>> parent of 3d15c1d (Changed project structure acording to redux style guide):src/redux/duks/posts.js
export const postsFetchError = (error) => ({
  type: POSTS_FETCH_ERROR,
  payload: error
})

// Selectors

export const selectPosts = (state) => state.getIn(['userPosts', 'posts'])
export const selectPostsLoad = (state) => state.getIn(['userPosts', 'load'])
export const selectPostsError = (state) => state.getIn(['userPosts', 'error'])
export const selectPostsUserId = (state) => state.getIn(['userPosts', 'userId'])

export const selectPostsMemo = createSelector(selectPosts, (posts) =>
  posts.toJS()
)

// Requests

const getPosts = async (id) => {
  const response = await axios.get(`${baseUrlPath}/users/${id}/posts`)
  return response.data
}

// Sagas

export const handlePostsFetch = function* () {
  try {
    const userId = yield select(selectPostsUserId)
    const posts = yield call(getPosts, userId)

    const cropedPosts = posts.map((post) => {
      post.body = `${post.body.slice(0, 50)}...`

      return post
    })

    yield put(postsFetchSuccess(cropedPosts))
  } catch (error) {
    yield put(postsFetchError(error.message))
  }
}

<<<<<<< HEAD:src/duks/postsPage/posts.js
export const watchPostsFetchSaga = function* () {
<<<<<<< HEAD:src/duks/postsPage/posts.js
  yield takeEvery(POSTS_FETCH_REQUEST, postsFetchSaga)
=======
export const watchPostsFetch = function* () {
  yield takeEvery(POSTS_FETCH, handlePostsFetch)
>>>>>>> parent of f24dd3f (added 'Saga' ending to all saga names):src/redux/duks/posts.js
=======
  yield takeEvery(POSTS_FETCH, postsFetchSaga)
>>>>>>> parent of 3d15c1d (Changed project structure acording to redux style guide):src/redux/duks/posts.js
}
