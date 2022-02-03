import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath } from '../../common/api'

// Types

const POST_FETCH_REQUEST = 'pet-app/duks/singlePostPage/POST_FETCH_REQUEST'
const POST_FETCH_SUCCESS = 'pet-app/duks/singlePostPage/POST_FETCH_SUCCESS'
const POST_FETCH_ERROR = 'pet-app/duks/singlePostPage/POST_FETCH_ERROR'

// Reducer

const initialState = fromJS({
  postId: 1,
  load: false,
  post: {},
  error: null
})

export default function singlePostReducer(state = initialState, action) {
  switch (action.type) {
    case POST_FETCH_REQUEST:
      return state.set('load', true).set('postId', action.payload)
    case POST_FETCH_SUCCESS:
      return state.set('load', false).set('post', fromJS(action.payload))
    case POST_FETCH_ERROR:
      return state.set('load', false).set('error', action)
    default:
      return state
  }
}

// Actions

export const singlePostFetch = (userId) => ({
  type: POST_FETCH_REQUEST,
  payload: userId
})
export const singlePostFetched = (post) => ({
  type: POST_FETCH_SUCCESS,
  payload: post
})
export const singlePostFetchError = (error) => ({
  type: POST_FETCH_ERROR,
  payload: error
})

// Selectors

export const selectSinglePost = (state) => state.getIn(['singlePost', 'post'])
export const selectSinglePostError = (state) =>
  state.getIn(['singlePost', 'error'])
export const selectSinglePostLoad = (state) =>
  state.getIn(['singlePost', 'load'])
export const selectSinglePostId = (state) =>
  state.getIn(['singlePost', 'postId'])

export const selectSinglePostMemo = createSelector(selectSinglePost, (post) =>
  post.toJS()
)

// Requests

const getSinglePost = async (id) => {
  const response = await axios.get(`${baseUrlPath}/posts/${id}`)
  return response.data
}

// Sagas

export const singlePostFetchSaga = function* () {
  try {
    const postId = yield select(selectSinglePostId)

    const post = yield call(getSinglePost, postId)

    yield put(singlePostFetched(post))
  } catch (error) {
    yield put(singlePostFetchError(error.message))
  }
}

export const watchSinglePostFetchSaga = function* () {
  yield takeEvery(POST_FETCH_REQUEST, singlePostFetchSaga)
}
