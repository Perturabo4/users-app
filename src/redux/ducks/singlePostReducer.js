import { Map, Record } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'
import { getRequest } from '../../utils/requests'

// SINGLE POST Reducer statuses
export const IDLE_STATUS = 'idle'
export const LOADING_STATUS = 'loading'
export const SUCCESS_STATUS = 'success'
export const FAILURE_STATUS = 'failure'

// Types
const duckName = 'singlePostReducer'
const SINGLE_POST_REQUEST = `${ducksPath}/${duckName}/SINGLE_POST_REQUEST`
const SINGLE_POST_SUCCESS = `${ducksPath}/${duckName}/SINGLE_POST_SUCCESS`
const SINGLE_POST_SET_PROGRESS = `${ducksPath}/${duckName}/SINGLE_POST_SET_PROGRESS`
const SINGLE_POST_ERROR = `${ducksPath}/${duckName}/SINGLE_POST_ERROR`

// Reducer

const record = Record({
  status: IDLE_STATUS,
  postId: null,
  inProgress: false,
  post: Map(),
  error: null
})

const initialState = record()

const singlePostIdleReducer = (state, action) => {
  switch (action.type) {
    case SINGLE_POST_REQUEST:
      return state
        .set('status', LOADING_STATUS)
        .set('post', Map())
        .set('error', null)
        .set('postId', action.payload)
    default:
      return state
  }
}

const singlePostLoadingReducer = (state, action) => {
  switch (action.type) {
    case SINGLE_POST_SUCCESS:
      return state
        .set('status', SUCCESS_STATUS)
        .set('post', Map(action.payload))
        .set('error', null)
    case SINGLE_POST_ERROR:
      return state
        .set('status', FAILURE_STATUS)
        .set('post', Map())
        .set('error', action.payload)
        .set('postId', null)
    default:
      return state
  }
}

export default function singlePostReducer(state = initialState, action) {
  switch (state['status']) {
    case IDLE_STATUS:
      return singlePostIdleReducer(state, action)
    case LOADING_STATUS:
      return singlePostLoadingReducer(state, action)
    case SUCCESS_STATUS:
    case FAILURE_STATUS:
      return singlePostIdleReducer(state, action)
    default:
      return state
  }
}

// Actions

export const postSetProgress = () => ({
  type: SINGLE_POST_SET_PROGRESS
})

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

export const selectSinglePostStatus = createSelector(
  selectPost,
  (state) => state['status']
)

export const selectSinglePostId = createSelector(
  selectPost,
  (state) => state['postId']
)

// Sagas

export const handlePostFetchSaga = function* () {
  try {
    const postId = yield select(selectSinglePostId)

    const post = yield call(getRequest, `${baseUrlPath}/posts/${postId}`)

    yield put(postFetchSuccess(post))
  } catch (error) {
    yield put(postFetchError(error.message))
  }
}

export const watchPostFetchSaga = function* () {
  yield takeEvery(SINGLE_POST_REQUEST, handlePostFetchSaga)
}
