import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath } from '../../common/api'

// ALL USERS TYPES

const USERS_FETCH_REQUEST = 'pet-app/duks/usersPage/USERS_FETCH_REQUEST'
const USERS_FETCH_SUCCES = 'pet-app/duks/usersPage/USERS_FETCH_SUCCES'
const USERS_FETCH_ERROR = 'pet-app/duks/usersPage/USERS_FETCH_ERROR'

// Reducer

const initialState = fromJS({
  load: false,
  users: [],
  error: null
})

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case USERS_FETCH_REQUEST:
      return state.set('load', true)
    case USERS_FETCH_SUCCES:
      return state.set('load', false).set('users', fromJS(action.payload))
    case USERS_FETCH_ERROR:
      return state.set('load', false).set('error', action.payload)
    default:
      return state
  }
}

// Actions

export const usersFetchRequest = () => ({ type: USERS_FETCH_REQUEST })
export const usersFetchSuccess = (users) => ({
  type: USERS_FETCH_SUCCES,
  payload: users
})
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

export const usersFetchSaga = function* () {
  try {
    const users = yield call(getUsers)
    yield put(usersFetchSuccess(users))
  } catch (error) {
    yield put(usersFetchError(error.message))
  }
}

export const watchUsersFetchSaga = function* () {
  yield takeEvery(USERS_FETCH_REQUEST, usersFetchSaga)
}
