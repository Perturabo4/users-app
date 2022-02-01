import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath } from '../../api'

// ALL USERS TYPES

export const USERS_FETCH = 'USERS_FETCH'
export const USERS_FETCHED = 'USERS_FETCHED'
export const USERS_FETCH_ERROR = 'USERS_FETCH_ERROR'

// Reducer

const initialState = fromJS({
  load: false,
  users: [],
  error: null
})

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case USERS_FETCH:
      return state.set('load', true)
    case USERS_FETCHED:
      return state.set('load', false).set('users', fromJS(action.payload))
    case USERS_FETCH_ERROR:
      return state.set('load', false).set('error', action.payload)
    default:
      return state
  }
}

// Actions

export const usersFetch = () => ({ type: USERS_FETCH })
export const usersFetched = (users) => ({ type: USERS_FETCHED, payload: users })
export const usersFetchError = (error) => ({
  type: USERS_FETCH_ERROR,
  payload: error
})

// Selectors

export const selectUsers = (state) => state.getIn(['allUsers', 'users'])
export const selectUsersLoad = (state) => state.getIn(['allUsers', 'load'])
export const selectUsersError = (state) => state.getIn(['allUsers', 'error'])

export const selectUsersMemo = createSelector(selectUsers, (users) =>
  users.toJS()
)

// Requests

const getUsers = async () => {
  const response = await axios.get(`${baseUrlPath}/users`)
  return response.data
}

// Sagas

export const handleUsersFetch = function* () {
  try {
    const users = yield call(getUsers)
    yield put(usersFetched(users))
  } catch (error) {
    yield put(usersFetchError(error.message))
  }
}

export const watchUsersFetch = function* () {
  yield takeEvery(USERS_FETCH, handleUsersFetch)
}
