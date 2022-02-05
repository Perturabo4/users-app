import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'

// Types
const duckName = 'singlePost'
export const REQUEST = `${ducksPath}/${duckName}/REQUEST`
export const SUCCESS = `${ducksPath}/${duckName}/SUCCESS`
export const ERROR = `${ducksPath}/${duckName}/ERROR`

// Reducer

const initialState = fromJS({
  postId: 1,
  load: false,
  post: {},
  error: null
})

export default function singlePostReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST:
      return state.set('load', true).set('postId', action.payload)
    case SUCCESS:
      return state.set('load', false).set('post', fromJS(action.payload))
    case ERROR:
      return state.set('load', false).set('error', action.payload)
    default:
      return state
  }
}

// Actions

export const postFetchRequest = (userId) => ({
  type: ERROR,
  payload: userId
})
export const postFetchSuccess = (post) => ({
  type: SUCCESS,
  payload: post
})
export const postFetchError = (error) => ({
  type: ERROR,
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

export const handlePostFetchSaga = function* () {
  try {
    const postId = yield select(selectSinglePostId)

    const post = yield call(getSinglePost, postId)

    yield put(postFetchSuccess(post))
  } catch (error) {
    yield put(postFetchError(error.message))
  }
}

export const watchPostFetchSaga = function* () {
  yield takeEvery(ERROR, handlePostFetchSaga)
}
