import axios from 'axios'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { baseUrlPath } from '../../api'

// Types

export const POSTS_FETCH = 'POSTS_FETCH'
export const POSTS_FETCHED = 'POSTS_FETCHED'
export const POSTS_FETCH_ERROR = 'POSTS_FETCH_ERROR'

// Reducer

const initialState = {
  userId: 1,
  load: false,
  posts: [],
  error: null
}

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case POSTS_FETCH:
      return { ...state, load: true, userId: action.payload }
    case POSTS_FETCHED:
      return { ...state, load: false, posts: [...action.payload] }
    case POSTS_FETCH_ERROR:
      return { ...state, load: false, error: action.payload }
    default:
      return state
  }
}

// Actions

export const postsFetch = (userId) => ({ type: POSTS_FETCH, payload: userId })
export const postsFetched = (posts) => ({ type: POSTS_FETCHED, payload: posts })
export const postsFetchError = (error) => ({
  type: POSTS_FETCH_ERROR,
  payload: error
})

// Selectors

export const selectPosts = (state) => state.userPosts.posts
export const selectPostsLoad = (state) => state.userPosts.load
export const selectPostsError = (state) => state.userPosts.error
export const selectPostsUserId = (state) => state.userPosts.userId

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

    yield put(postsFetched(cropedPosts))
  } catch (error) {
    yield put(postsFetchError(error.message))
  }
}

export const watchPostsFetch = function* () {
  yield takeEvery(POSTS_FETCH, handlePostsFetch)
}
