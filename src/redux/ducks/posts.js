import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'

// Types
const duckName = 'posts'

export const REQUEST = `${ducksPath}/${duckName}/REQUEST`
export const SUCCESS = `${ducksPath}/${duckName}/SUCCESS`
export const ERROR = `${ducksPath}/${duckName}/ERROR`

// Reducer

const initialState = fromJS({
  userId: 1,
  load: false,
  posts: [],
  error: null
})

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST:
      return state.set('load', true).set('userId', action.payload)
    case SUCCESS:
      return state.set('load', false).set('posts', fromJS(action.payload))
    case ERROR:
      return state.set('load', false).set('error', action.payload)
    default:
      return state
  }
}

// Actions

export const postsFetchRequest = (userId) => ({
  type: REQUEST,
  payload: userId
})
export const postsFetchSuccess = (posts) => ({
  type: SUCCESS,
  payload: posts
})
export const postsFetchError = (error) => ({
  type: ERROR,
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

export const postsFetchSaga = function* () {
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

export const watchPostsFetchSaga = function* () {
  yield takeEvery(REQUEST, postsFetchSaga)
}
