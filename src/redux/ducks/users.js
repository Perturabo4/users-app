import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'

// ALL USERS TYPES
const duckName = 'users'
const USERS_FETCH_REQUEST = `${ducksPath}/${duckName}/USERS_FETCH_REQUEST`
const USERS_FETCH_SUCCES = `${ducksPath}/${duckName}/USERS_FETCH_SUCCES`
const USERS_FETCH_ERROR = `${ducksPath}/${duckName}USERS_FETCH_ERROR`

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
export const selectUsers = (state) => state.get('allUsers')

export const selectUsersMemo = createSelector(selectUsers, (allUsers) =>
  allUsers.get('users').toJS()
)
export const selectUsersLoad = createSelector(selectUsers, (allUsers) =>
  allUsers.get('load')
)
export const selectUsersError = createSelector(selectUsers, (allUsers) =>
  allUsers.get('error')
)

// Requests

const getUsers = async () => {
  const response = await axios.get(`${baseUrlPath}/users`)
  return response.data
}

// Sagas
let idle = false
export const handleUsersSaga = function* () {
  if (idle) return
  idle = true
  try {
    const users = yield call(getUsers)
    yield put(usersFetchSuccess(users))
  } catch (error) {
    yield put(usersFetchError(error.message))
  } finally {
    idle = false
  }
}

export const watchUsersFetchSaga = function* () {
  yield takeEvery(USERS_FETCH_REQUEST, handleUsersSaga)
}
