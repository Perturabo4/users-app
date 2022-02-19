import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'

// Types
const duckName = 'singlePost'
const SINGLE_POST_REQUEST = `${ducksPath}/${duckName}/SINGLE_POST_REQUEST`
const SINGLE_POST_SUCCESS = `${ducksPath}/${duckName}/SINGLE_POST_SUCCESS`
const SINGLE_POST_ERROR = `${ducksPath}/${duckName}/SINGLE_POST_ERROR`

// Reducer

const initialState = fromJS({
  postId: 1,
  load: false,
  post: {},
  error: null
})

export default function singlePostReducer(state = initialState, action) {
  switch (action.type) {
    case SINGLE_POST_REQUEST:
      return state.set('load', true).set('postId', action.payload)
    case SINGLE_POST_SUCCESS:
      return state.set('load', false).set('post', fromJS(action.payload))
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

export const selectSinglePost = createSelector(selectPost, (state) =>
  state.get('post').toJS()
)
export const selectSinglePostError = createSelector(selectPost, (state) =>
  state.get('error')
)
export const selectSinglePostLoad = createSelector(selectPost, (state) =>
  state.get('load')
)
export const selectSinglePostId = createSelector(selectPost, (state) =>
  state.get('postId')
)

// Requests

const getSinglePost = async (id) => {
  const response = await axios.get(`${baseUrlPath}/posts/${id}`)
  return response.data
}

// Sagas
let idle = false
export const handlePostFetchSaga = function* () {
  if (idle) return
  try {
    const postId = yield select(selectSinglePostId)

    const post = yield call(getSinglePost, postId)

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
