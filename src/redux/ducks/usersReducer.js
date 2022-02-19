import { fromJS, List, Record } from 'immutable'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'
import { getRequest } from '../../utils/requests'

// ALL USERS TYPES
const duckName = 'users'
const USERS_FETCH_REQUEST = `${ducksPath}/${duckName}/USERS_FETCH_REQUEST`
const USERS_FETCH_SUCCES = `${ducksPath}/${duckName}/USERS_FETCH_SUCCES`
const USERS_FETCH_ERROR = `${ducksPath}/${duckName}USERS_FETCH_ERROR`

// Reducer

const record = Record({
  load: false,
  users: List([]),
  error: null
})

const initialState = record()

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case USERS_FETCH_REQUEST:
      return state.set('load', true)
    case USERS_FETCH_SUCCES:
      return state.set('load', false).set('users', List(action.payload))
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

export const selectUsersMemo = createSelector(
  selectUsers,
  (allUsers) => allUsers['users']
)
export const selectUsersLoad = createSelector(
  selectUsers,
  (allUsers) => allUsers['load']
)
export const selectUsersError = createSelector(
  selectUsers,
  (allUsers) => allUsers['error']
)

// Sagas
let idle = false
export const handleUsersSaga = function* () {
  if (idle) return
  idle = true
  try {
    const users = yield call(getRequest, `${baseUrlPath}/users`)
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
