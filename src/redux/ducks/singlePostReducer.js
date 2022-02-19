import { Map, Record } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'
import { getRequest } from '../../utils/requests'

// Types
const duckName = 'singlePost'
const SINGLE_POST_REQUEST = `${ducksPath}/${duckName}/SINGLE_POST_REQUEST`
const SINGLE_POST_SUCCESS = `${ducksPath}/${duckName}/SINGLE_POST_SUCCESS`
const SINGLE_POST_ERROR = `${ducksPath}/${duckName}/SINGLE_POST_ERROR`

// Reducer

const record = Record({
  postId: 1,
  load: false,
  post: {},
  error: null
})

const initialState = record()

export default function singlePostReducer(state = initialState, action) {
  switch (action.type) {
    case SINGLE_POST_REQUEST:
      return state.set('load', true).set('postId', action.payload)
    case SINGLE_POST_SUCCESS:
      return state.set('load', false).set('post', Map(action.payload))
    case SINGLE_POST_ERROR:
      return state.set('load', false).set('error', action.payload)
    default:
      return state
  }
}

// Actions

export const postFetchRequest = (userId) => ({
  type: SINGLE_POST_REQUEST,
  payload: userId
})
export const postFetchSuccess = (post) => ({
  type: SINGLE_POST_SUCCESS,
  payload: post
})
export const postFetchError = (error) => ({
  type: SINGLE_POST_ERROR,
  payload: error
})

// Selectors
const selectPost = (state) => state.get('singlePost')

export const selectSinglePost = createSelector(
  selectPost,
  (state) => state['post']
)
export const selectSinglePostError = createSelector(
  selectPost,
  (state) => state['error']
)
export const selectSinglePostLoad = createSelector(
  selectPost,
  (state) => state['load']
)
export const selectSinglePostId = createSelector(
  selectPost,
  (state) => state['postId']
)

// Sagas
let idle = false
export const handlePostFetchSaga = function* () {
  if (idle) return
  try {
    const postId = yield select(selectSinglePostId)

    const post = yield call(getRequest, `${baseUrlPath}/posts/${postId}`)

    yield put(postFetchSuccess(post))
  } catch (error) {
    yield put(postFetchError(error.message))
  } finally {
    idle = false
  }
}

export const watchPostFetchSaga = function* () {
  yield takeEvery(SINGLE_POST_REQUEST, handlePostFetchSaga)
}
