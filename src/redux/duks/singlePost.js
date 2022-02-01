import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath } from '../../api'
import { selectPosts } from './posts'

// Types

export const SINGLE_POST_FETCH = 'SINGLE_POST_FETCH'
export const SINGLE_POST_FETCHED = 'SINGLE_POST_FETCHED'
export const SINGLE_POST_FETCH_ERROR = 'SINGLE_POST_FETCH_ERROR'

// Reducer

const initialState = fromJS({
  postId: 1,
  load: false,
  post: {},
  error: null
})

export default function singlePostReducer(state = initialState, action) {
  switch (action.type) {
    case SINGLE_POST_FETCH:
      // return { ...state, load: true, postId: action.payload }
      return state.set('load', true).set('postId', action.payload)
    case SINGLE_POST_FETCHED:
      // return {
      //   ...state,
      //   load: false,
      //   post: { ...action.payload },
      // }
      return state.set('load', false).set('post', fromJS(action.payload))
    case SINGLE_POST_FETCH_ERROR:
      // return { ...state, load: false, error: action.payload }
      return state.set('load', false).set('error', action)
    default:
      return state
  }
}

// Actions

export const singlePostFetch = (userId) => ({
  type: SINGLE_POST_FETCH,
  payload: userId
})
export const singlePostFetched = (post) => ({
  type: SINGLE_POST_FETCHED,
  payload: post
})
export const singlePostFetchError = (error) => ({
  type: SINGLE_POST_FETCH_ERROR,
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

export const handleSinglePostFetch = function* () {
  try {
    const postId = yield select(selectSinglePostId)

    const post = yield call(getSinglePost, postId)

    yield put(singlePostFetched(post))
  } catch (error) {
    yield put(singlePostFetchError(error.message))
  }
}

export const watchSinglePostFetch = function* () {
  yield takeEvery(SINGLE_POST_FETCH, handleSinglePostFetch)
}
