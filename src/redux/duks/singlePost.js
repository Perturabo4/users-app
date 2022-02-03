import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
<<<<<<< HEAD:src/duks/singlePostPage/singlePost.js
<<<<<<< HEAD:src/duks/singlePostPage/singlePost.js
import { baseUrlPath } from '../../common/api'
=======
import { baseUrlPath } from '../../api'
import { selectPosts } from './posts'
>>>>>>> parent of f24dd3f (added 'Saga' ending to all saga names):src/redux/duks/singlePost.js
=======
import { baseUrlPath } from '../../api'
>>>>>>> parent of 3d15c1d (Changed project structure acording to redux style guide):src/redux/duks/singlePost.js

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
<<<<<<< HEAD:src/duks/singlePostPage/singlePost.js
<<<<<<< HEAD:src/duks/singlePostPage/singlePost.js
    case POST_FETCH_REQUEST:
=======
    case SINGLE_POST_FETCH:
>>>>>>> parent of 3d15c1d (Changed project structure acording to redux style guide):src/redux/duks/singlePost.js
      return state.set('load', true).set('postId', action.payload)
    case SINGLE_POST_FETCHED:
      return state.set('load', false).set('post', fromJS(action.payload))
<<<<<<< HEAD:src/duks/singlePostPage/singlePost.js
    case POST_FETCH_ERROR:
=======
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
>>>>>>> parent of f24dd3f (added 'Saga' ending to all saga names):src/redux/duks/singlePost.js
=======
    case SINGLE_POST_FETCH_ERROR:
>>>>>>> parent of 3d15c1d (Changed project structure acording to redux style guide):src/redux/duks/singlePost.js
      return state.set('load', false).set('error', action)
    default:
      return state
  }
}

// Actions

<<<<<<< HEAD:src/duks/singlePostPage/singlePost.js
export const postFetchRequest = (userId) => ({
  type: POST_FETCH_REQUEST,
  payload: userId
})
export const postFetchSuccess = (post) => ({
  type: POST_FETCH_SUCCESS,
  payload: post
})
export const postFetchError = (error) => ({
  type: POST_FETCH_ERROR,
=======
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
>>>>>>> parent of 3d15c1d (Changed project structure acording to redux style guide):src/redux/duks/singlePost.js
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

    yield put(postFetchSuccess(post))
  } catch (error) {
    yield put(postFetchError(error.message))
  }
}

<<<<<<< HEAD:src/duks/singlePostPage/singlePost.js
export const watchSinglePostFetchSaga = function* () {
<<<<<<< HEAD:src/duks/singlePostPage/singlePost.js
  yield takeEvery(POST_FETCH_REQUEST, singlePostFetchSaga)
=======
export const watchSinglePostFetch = function* () {
  yield takeEvery(SINGLE_POST_FETCH, handleSinglePostFetch)
>>>>>>> parent of f24dd3f (added 'Saga' ending to all saga names):src/redux/duks/singlePost.js
=======
  yield takeEvery(SINGLE_POST_FETCH, singlePostFetchSaga)
>>>>>>> parent of 3d15c1d (Changed project structure acording to redux style guide):src/redux/duks/singlePost.js
}
